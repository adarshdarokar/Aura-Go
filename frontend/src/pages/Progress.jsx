
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const MEASUREMENTS = [
  { key: "chest", label: "Chest", unit: "cm" },
  { key: "waist", label: "Waist", unit: "cm" },
  { key: "arms", label: "Arms", unit: "cm" },
  { key: "shoulders", label: "Shoulders", unit: "cm" },
  { key: "thighs", label: "Thighs", unit: "cm" },
];

const EMPTY_FORM = {
  date: getLocalDate(),
  weight: "",
  chest: "",
  waist: "",
  arms: "",
  shoulders: "",
  thighs: "",
  notes: "",
};

function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function getDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value, options = {}) {
  const date = getDate(value);
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

function getRecordId(record) {
  return record?._id || record?.id;
}

function getMeasurements(record) {
  return record?.bodyMeasurements || {};
}

function getNumericValue(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#626262]/30 bg-[#626262]/[0.07] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#858585]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-[#EDEDED]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-[#858585]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Trend({ value }) {
  if (value === null || value === undefined) {
    return <span className="text-xs text-[#858585]">No comparison yet</span>;
  }

  if (value === 0) {
    return (
      <span className="text-xs text-[#858585]">No change from previous</span>
    );
  }

  return (
    <span
      className={`text-xs font-medium ${
        value < 0 ? "text-emerald-400" : "text-[#EDEDED]"
      }`}
    >
      {value > 0 ? "+" : ""}
      {value.toFixed(1)} kg from previous
    </span>
  );
}

function WeightChart({ records }) {
  const chartRecords = records
    .filter((record) => getNumericValue(record.weight) !== null)
    .slice(-10);

  if (chartRecords.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#626262]/30 text-[#858585]">
          <ChartIcon />
        </div>
        <p className="text-sm font-medium text-[#EDEDED]">No weight data yet</p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-[#858585]">
          Add your first weight entry to start tracking your progress.
        </p>
      </div>
    );
  }

  const values = chartRecords.map((record) => Number(record.weight));
  const actualMin = Math.min(...values);
  const actualMax = Math.max(...values);
  const range = actualMax - actualMin || 1;
  const min = actualMin - range * 0.2;
  const max = actualMax + range * 0.2;

  const width = 640;
  const height = 210;
  const left = 38;
  const right = 12;
  const top = 18;
  const bottom = 32;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const points = values.map((value, index) => ({
    x:
      chartRecords.length === 1
        ? left + plotWidth / 2
        : left + (index / (chartRecords.length - 1)) * plotWidth,
    y: top + ((max - value) / (max - min)) * plotHeight,
    value,
    record: chartRecords[index],
  }));

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  const areaPath =
    points.length > 1
      ? `M ${points[0].x} ${height - bottom} L ${points
          .map((point) => `${point.x} ${point.y}`)
          .join(" L ")} L ${points[points.length - 1].x} ${
          height - bottom
        } Z`
      : "";

  const gridValues = [0, 1, 2, 3].map(
    (index) => max - (index / 3) * (max - min)
  );

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-[#EDEDED]">
            {values[values.length - 1].toFixed(1)}
            <span className="ml-1 text-sm font-normal text-[#858585]">kg</span>
          </p>
          <p className="mt-1 text-xs text-[#858585]">Latest logged weight</p>
        </div>
        <span className="rounded-full border border-[#626262]/30 px-3 py-1.5 text-xs text-[#858585]">
          Last {chartRecords.length} entries
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Weight history chart"
      >
        {gridValues.map((value, index) => {
          const y = top + (index / 3) * plotHeight;
          return (
            <g key={index}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="3 5"
              />
              <text
                x={left - 8}
                y={y + 4}
                textAnchor="end"
                fill="#858585"
                fontSize="10"
              >
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}

        {areaPath && <path d={areaPath} fill="#EDEDED" fillOpacity="0.055" />}

        {points.length > 1 && (
          <polyline
            points={polyline}
            fill="none"
            stroke="#EDEDED"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((point, index) => (
          <g key={getRecordId(point.record) || index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#0E0E0E"
              stroke="#EDEDED"
              strokeWidth="2"
            >
              <title>
                {formatDate(point.record.date)}: {point.value} kg
              </title>
            </circle>
          </g>
        ))}

        {points.map((point, index) => {
          if (
            chartRecords.length > 5 &&
            index !== 0 &&
            index !== chartRecords.length - 1 &&
            index % 2 !== 0
          ) {
            return null;
          }

          return (
            <text
              key={`date-${getRecordId(point.record) || index}`}
              x={point.x}
              y={height - 8}
              fill="#858585"
              fontSize="10"
              textAnchor={
                index === 0
                  ? "start"
                  : index === points.length - 1
                    ? "end"
                    : "middle"
              }
            >
              {formatDate(point.record.date, {
                day: "2-digit",
                month: "short",
                year: undefined,
              })}
            </text>
          );
        })}
      </svg>

      {chartRecords.length === 1 && (
        <p className="mt-2 text-center text-xs text-[#858585]">
          Add another weight entry to see your trend.
        </p>
      )}
    </div>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" strokeLinecap="round" />
      <path
        d="m7 14 4-4 3 3 6-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Field({ label, unit, ...props }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-[#BDBDBD]">
        {label}
        {unit && <span className="text-[#707070]">{unit}</span>}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-[#626262]/40 bg-[#0E0E0E] px-3.5 py-3 text-sm text-[#EDEDED] outline-none transition placeholder:text-[#626262] focus:border-[#EDEDED]/70 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  );
}

function Notice({ type = "error", children, onDismiss }) {
  const styles =
    type === "success"
      ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300"
      : "border-red-400/20 bg-red-400/[0.06] text-red-300";

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-current opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function Progress() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM }));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchProgress = useCallback(async (requestedPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/progress`, {
        withCredentials: true,
        params: { page: requestedPage, limit: 30 },
      });

      const payload = response.data?.data ?? response.data;
      const fetched = Array.isArray(payload)
        ? payload
        : payload?.progress || payload?.records || [];

      setRecords((current) =>
        requestedPage === 1 ? fetched : [...current, ...fetched]
      );

      const pagination = payload?.pagination;
      setPage(requestedPage);
      setHasMore(
        pagination
          ? requestedPage < Number(pagination.totalPages || 1)
          : fetched.length === 30
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress(1);
  }, [fetchProgress]);

  const chronologicalRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) =>
          (getDate(a.date)?.getTime() || 0) -
          (getDate(b.date)?.getTime() || 0)
      ),
    [records]
  );

  const latestWeightRecord = useMemo(
    () =>
      [...chronologicalRecords]
        .reverse()
        .find((record) => getNumericValue(record.weight) !== null),
    [chronologicalRecords]
  );

  const previousWeightRecord = useMemo(() => {
    if (!latestWeightRecord) return null;

    const weightedRecords = chronologicalRecords.filter(
      (record) => getNumericValue(record.weight) !== null
    );

    return weightedRecords.length > 1
      ? weightedRecords[weightedRecords.length - 2]
      : null;
  }, [chronologicalRecords, latestWeightRecord]);

  const weightChange =
    latestWeightRecord && previousWeightRecord
      ? Number(latestWeightRecord.weight) - Number(previousWeightRecord.weight)
      : null;

  const latestMeasurements = useMemo(() => {
    const result = {};

    [...chronologicalRecords].reverse().forEach((record) => {
      const measurements = getMeasurements(record);

      MEASUREMENTS.forEach(({ key }) => {
        if (
          result[key] === undefined &&
          getNumericValue(measurements[key]) !== null
        ) {
          result[key] = {
            value: Number(measurements[key]),
            date: record.date,
          };
        }
      });
    });

    return result;
  }, [chronologicalRecords]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (form.date > getLocalDate()) {
      setError("Progress date cannot be in the future.");
      return;
    }

    const weight = getNumericValue(form.weight);
    const bodyMeasurements = {};

    if (form.weight.trim() !== "") {
      if (weight === null || weight < 1 || weight > 500) {
        setError("Weight must be between 1 and 500 kg.");
        return;
      }
    }

    for (const { key, label } of MEASUREMENTS) {
      const rawValue = form[key].trim();
      if (rawValue === "") continue;

      const value = getNumericValue(rawValue);
      if (value === null || value < 0 || value > 500) {
        setError(`${label} must be a valid value between 0 and 500 cm.`);
        return;
      }

      bodyMeasurements[key] = value;
    }

    if (weight === null && Object.keys(bodyMeasurements).length === 0) {
      setError("Enter your weight or at least one body measurement.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        date: form.date,
        weight,
        bodyMeasurements,
        notes: form.notes.trim(),
      };

      await axios.post(`${API_URL}/progress`, payload, {
        withCredentials: true,
      });

      setForm({ ...EMPTY_FORM, date: getLocalDate() });
      setNotice("Progress entry saved successfully.");
      await fetchProgress(1);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = getRecordId(pendingDelete);
    if (!id) {
      setError("This entry does not have a valid ID.");
      setPendingDelete(null);
      return;
    }

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      await axios.delete(`${API_URL}/progress/${id}`, {
        withCredentials: true,
      });

      setRecords((current) =>
        current.filter((record) => getRecordId(record) !== id)
      );
      setNotice("Progress entry deleted.");
      setPendingDelete(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const statCards = [
    {
      label: "Current weight",
      value:
        latestWeightRecord &&
        getNumericValue(latestWeightRecord.weight) !== null
          ? `${Number(latestWeightRecord.weight).toFixed(1)}`
          : "—",
      unit: latestWeightRecord ? "kg" : "",
      detail: latestWeightRecord
        ? `Updated ${formatDate(latestWeightRecord.date)}`
        : "Log your first weight",
    },
    {
      label: "Weight change",
      value:
        weightChange === null
          ? "—"
          : `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}`,
      unit: weightChange === null ? "" : "kg",
      detail: previousWeightRecord
        ? "Since previous weight entry"
        : "Requires two weight entries",
    },
    {
      label: "Total entries",
      value: String(records.length),
      unit: "",
      detail: "Progress logs loaded",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0E0E0E] px-4 py-6 text-[#EDEDED] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#858585]">
              AURA GO / PERFORMANCE
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your progress<span className="text-[#858585]">.</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#858585]">
              Track the changes. Stay consistent. Let your results speak.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#626262]/30 px-3.5 py-2 text-xs text-[#BDBDBD]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Personal progress tracker
          </div>
        </header>

        {error && (
          <div className="mb-5">
            <Notice onDismiss={() => setError("")}>{error}</Notice>
          </div>
        )}

        {notice && (
          <div className="mb-5">
            <Notice
              type="success"
              onDismiss={() => setNotice("")}
            >
              {notice}
            </Notice>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-5 sm:p-6">
              <p className="text-xs font-medium text-[#858585]">
                {stat.label}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm text-[#858585]">{stat.unit}</span>
                )}
              </div>
              <p className="mt-2 text-xs text-[#707070]">{stat.detail}</p>
            </Card>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card className="min-w-0 p-5 sm:p-6">
            <SectionHeading
              eyebrow="Weight analytics"
              title="Weight history"
              description="Your logged weight over time."
            />

            {loading && records.length === 0 ? (
              <div className="flex h-[220px] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#626262] border-t-[#EDEDED]" />
              </div>
            ) : (
              <WeightChart records={chronologicalRecords} />
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <SectionHeading
              eyebrow="Body metrics"
              title="Latest measurements"
              description="Most recent value recorded for each metric."
            />

            <div className="divide-y divide-[#626262]/20">
              {MEASUREMENTS.map((measurement) => {
                const latest = latestMeasurements[measurement.key];

                return (
                  <div
                    key={measurement.key}
                    className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#D8D8D8]">
                        {measurement.label}
                      </p>
                      <p className="mt-1 text-[11px] text-[#707070]">
                        {latest ? formatDate(latest.date) : "Not recorded"}
                      </p>
                    </div>
                    <p className="text-lg font-semibold tabular-nums">
                      {latest ? latest.value : "—"}
                      <span className="ml-1 text-xs font-normal text-[#858585]">
                        {latest ? measurement.unit : ""}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="mb-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_0.85fr]">
          <Card className="p-5 sm:p-6">
            <SectionHeading
              eyebrow="New record"
              title="Log your progress"
              description="Record your weight and measurements for a date."
            />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Date"
                  type="date"
                  value={form.date}
                  max={getLocalDate()}
                  onChange={(event) =>
                    updateField("date", event.target.value)
                  }
                  required
                  disabled={saving}
                />

                <Field
                  label="Body weight"
                  unit="kg"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="500"
                  step="0.1"
                  placeholder="e.g. 60.5"
                  value={form.weight}
                  onChange={(event) =>
                    updateField("weight", event.target.value)
                  }
                  disabled={saving}
                />
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-[#BDBDBD]">
                  Body measurements
                  <span className="ml-2 font-normal text-[#707070]">
                    All optional · centimetres
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {MEASUREMENTS.map((measurement) => (
                    <Field
                      key={measurement.key}
                      label={measurement.label}
                      unit="cm"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="500"
                      step="0.1"
                      placeholder="—"
                      value={form[measurement.key]}
                      onChange={(event) =>
                        updateField(measurement.key, event.target.value)
                      }
                      disabled={saving}
                    />
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-[#BDBDBD]">
                  Notes <span className="text-[#707070]">(optional)</span>
                </span>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    updateField("notes", event.target.value)
                  }
                  maxLength={500}
                  rows={3}
                  placeholder="Workout, routine, or anything worth noting..."
                  disabled={saving}
                  className="w-full resize-y rounded-xl border border-[#626262]/40 bg-[#0E0E0E] px-3.5 py-3 text-sm text-[#EDEDED] outline-none transition placeholder:text-[#626262] focus:border-[#EDEDED]/70 disabled:opacity-50"
                />
                <span className="mt-1 block text-right text-[10px] text-[#707070]">
                  {form.notes.length}/500
                </span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EDEDED] px-5 py-3.5 text-sm font-semibold text-[#0E0E0E] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E]" />
                    Saving progress...
                  </>
                ) : (
                  "Save progress"
                )}
              </button>
            </form>
          </Card>

          <Card className="p-5 sm:p-6">
            <SectionHeading
              eyebrow="Consistency"
              title="Your tracking summary"
              description="A snapshot of the progress you have logged."
            />

            <div className="space-y-3">
              <div className="rounded-xl border border-[#626262]/25 bg-[#0E0E0E]/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#BDBDBD]">
                    First recorded weight
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {chronologicalRecords.find(
                      (record) => getNumericValue(record.weight) !== null
                    )?.weight ?? "—"}
                    {chronologicalRecords.some(
                      (record) => getNumericValue(record.weight) !== null
                    ) && (
                      <span className="ml-1 text-xs font-normal text-[#858585]">
                        kg
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#626262]/25 bg-[#0E0E0E]/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#BDBDBD]">
                    Latest weight change
                  </span>
                  <Trend value={weightChange} />
                </div>
              </div>

              <div className="rounded-xl border border-[#626262]/25 bg-[#0E0E0E]/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#BDBDBD]">
                    Most recent entry
                  </span>
                  <span className="text-xs font-medium text-[#EDEDED]">
                    {chronologicalRecords.length
                      ? formatDate(
                          chronologicalRecords[
                            chronologicalRecords.length - 1
                          ].date
                        )
                      : "No entries"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#626262]/20 pt-5">
              <p className="text-xs leading-6 text-[#858585]">
                Tip: take measurements under similar conditions each time.
                Consistent tracking makes changes easier to compare.
              </p>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="p-5 sm:p-6">
            <SectionHeading
              eyebrow="Your records"
              title="Progress history"
              description="Review and manage your saved entries."
              action={
                <span className="rounded-full border border-[#626262]/30 px-3 py-1.5 text-xs text-[#858585]">
                  {records.length} loaded
                </span>
              }
            />
          </div>

          {loading && records.length === 0 ? (
            <div className="space-y-3 px-5 pb-6 sm:px-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-[#626262]/10"
                />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="border-t border-[#626262]/20 px-5 py-14 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#626262]/30 text-[#858585]">
                <ChartIcon />
              </div>
              <p className="text-sm font-medium">Your history starts here</p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#858585]">
                Save your first progress entry above. Your records will appear
                here.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto border-t border-[#626262]/20 md:block">
                <table className="w-full text-left">
                  <thead className="bg-[#626262]/[0.06]">
                    <tr className="text-[10px] uppercase tracking-[0.13em] text-[#858585]">
                      <th className="px-6 py-3.5 font-medium">Date</th>
                      <th className="px-4 py-3.5 font-medium">Weight</th>
                      <th className="px-4 py-3.5 font-medium">Chest</th>
                      <th className="px-4 py-3.5 font-medium">Waist</th>
                      <th className="px-4 py-3.5 font-medium">Arms</th>
                      <th className="px-4 py-3.5 font-medium">Notes</th>
                      <th className="px-6 py-3.5 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#626262]/15">
                    {[...records]
                      .sort(
                        (a, b) =>
                          (getDate(b.date)?.getTime() || 0) -
                          (getDate(a.date)?.getTime() || 0)
                      )
                      .map((record) => {
                        const measurements = getMeasurements(record);
                        const id = getRecordId(record);

                        return (
                          <tr
                            key={id || `${record.date}-${record.weight}`}
                            className="transition hover:bg-white/[0.015]"
                          >
                            <td className="whitespace-nowrap px-6 py-4 text-xs text-[#BDBDBD]">
                              {formatDate(record.date)}
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold tabular-nums">
                              {getNumericValue(record.weight) !== null
                                ? `${Number(record.weight).toFixed(1)} kg`
                                : "—"}
                            </td>
                            {["chest", "waist", "arms"].map((key) => (
                              <td
                                key={key}
                                className="px-4 py-4 text-xs tabular-nums text-[#BDBDBD]"
                              >
                                {getNumericValue(measurements[key]) !== null
                                  ? `${measurements[key]} cm`
                                  : "—"}
                              </td>
                            ))}
                            <td
                              className="max-w-[180px] truncate px-4 py-4 text-xs text-[#858585]"
                              title={record.notes || ""}
                            >
                              {record.notes || "—"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => setPendingDelete(record)}
                                disabled={!id || Boolean(deletingId)}
                                className="rounded-lg px-3 py-2 text-xs text-[#858585] transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 border-t border-[#626262]/20 p-4 md:hidden">
                {[...records]
                  .sort(
                    (a, b) =>
                      (getDate(b.date)?.getTime() || 0) -
                      (getDate(a.date)?.getTime() || 0)
                  )
                  .map((record) => {
                    const measurements = getMeasurements(record);
                    const id = getRecordId(record);

                    return (
                      <div
                        key={id || `${record.date}-${record.weight}`}
                        className="rounded-xl border border-[#626262]/25 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">
                              {formatDate(record.date)}
                            </p>
                            <p className="mt-1 text-xs text-[#858585]">
                              {getNumericValue(record.weight) !== null
                                ? `${Number(record.weight).toFixed(1)} kg`
                                : "Weight not recorded"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(record)}
                            disabled={!id || Boolean(deletingId)}
                            className="rounded-lg border border-[#626262]/30 px-3 py-2 text-xs text-[#BDBDBD] hover:border-red-400/40 hover:text-red-300 disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {MEASUREMENTS.map(({ key, label }) => (
                            <div key={key}>
                              <p className="text-[10px] text-[#707070]">
                                {label}
                              </p>
                              <p className="mt-1 text-xs font-medium tabular-nums text-[#D8D8D8]">
                                {getNumericValue(measurements[key]) !== null
                                  ? `${measurements[key]} cm`
                                  : "—"}
                              </p>
                            </div>
                          ))}
                        </div>

                        {record.notes && (
                          <p className="mt-4 border-t border-[#626262]/20 pt-3 text-xs leading-5 text-[#858585]">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          {hasMore && (
            <div className="border-t border-[#626262]/20 p-4 text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => fetchProgress(page + 1)}
                className="rounded-xl border border-[#626262]/35 px-5 py-3 text-sm text-[#D8D8D8] transition hover:bg-[#626262]/10 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more entries"}
              </button>
            </div>
          )}
        </Card>

        {pendingDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !deletingId) {
                setPendingDelete(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              className="w-full max-w-sm rounded-2xl border border-[#626262]/40 bg-[#151515] p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.07] text-red-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M3 6h18M9 6V4h6v2m-9 0 1 14h10l1-14M10 10v6m4-6v6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2
                id="delete-dialog-title"
                className="text-lg font-semibold"
              >
                Delete progress entry?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#858585]">
                The record from {formatDate(pendingDelete.date)} will be
                permanently deleted. This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={Boolean(deletingId)}
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 rounded-xl border border-[#626262]/40 px-4 py-3 text-sm text-[#D8D8D8] hover:bg-[#626262]/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={Boolean(deletingId)}
                  onClick={handleDelete}
                  className="flex-1 rounded-xl bg-red-400 px-4 py-3 text-sm font-semibold text-[#0E0E0E] hover:bg-red-300 disabled:opacity-50"
                >
                  {deletingId ? "Deleting..." : "Delete entry"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
