"use client";

import { FormEvent, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";

const filters: Record<Filter, (task: Task) => boolean> = {
  all: () => true,
  active: (task) => !task.done,
  completed: (task) => task.done,
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTasks = useMemo(
    () => tasks.filter(filters[filter]),
    [tasks, filter],
  );

  const completedCount = tasks.filter((task) => task.done).length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setTasks((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        done: false,
      },
    ]);
    setTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((previous) => previous.filter((task) => !task.done));
  };

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-4 py-16 text-slate-50">
      <main className="w-full max-w-3xl space-y-12 rounded-3xl bg-slate-900/60 p-10 shadow-2xl shadow-slate-900/40 ring-1 ring-white/5 backdrop-blur">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Organiza tu día</p>
          <h1 className="text-4xl font-semibold leading-tight">Mis tareas</h1>
          <p className="text-slate-300">
            Añade lo que necesites hacer, marca lo completado y mantén el control
            con filtros rápidos y un resumen claro.
          </p>
        </header>

        <section className="rounded-2xl bg-slate-950/50 p-6 ring-1 ring-white/5">
          <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="new-task">
              Nueva tarea
            </label>
            <input
              id="new-task"
              className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-indigo-400"
              placeholder="Ej. Preparar la presentación de mañana"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-500/50"
              disabled={!title.trim()}
            >
              Añadir
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-200">
            {(["all", "active", "completed"] as Filter[]).map((current) => (
              <button
                key={current}
                onClick={() => setFilter(current)}
                className={`rounded-full border px-4 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
                  filter === current
                    ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                {current === "all" && "Todas"}
                {current === "active" && "Pendientes"}
                {current === "completed" && "Completadas"}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-6 py-4 ring-1 ring-white/5">
            <div>
              <p className="text-sm text-slate-400">Progreso</p>
              <p className="text-xl font-semibold">
                {completedCount}/{tasks.length || 0} tareas completas
              </p>
            </div>
            <button
              type="button"
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 disabled:cursor-not-allowed disabled:text-slate-500 disabled:hover:bg-transparent"
            >
              Limpiar completadas
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-10 py-12 text-center text-slate-300">
              <p className="text-lg font-semibold">No hay tareas {filter !== "all" ? "en esta vista" : "todavía"}.</p>
              <p className="text-sm text-slate-400">
                Crea una nueva tarea para comenzar o cambia el filtro para ver otras
                categorías.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="group flex items-center gap-4 rounded-2xl bg-slate-950/60 px-5 py-4 ring-1 ring-white/5 transition hover:ring-indigo-400/60"
                >
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 rounded border border-white/20 bg-slate-800 text-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-base font-semibold transition ${
                        task.done ? "text-slate-400 line-through" : "text-slate-50"
                      }`}
                    >
                      {task.title}
                    </label>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      {task.done ? "Completada" : "Pendiente"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200 opacity-0 transition hover:bg-rose-500/15 hover:text-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 group-hover:opacity-100"
                  >
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
