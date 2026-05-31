'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSupabase } from '@/lib/use-supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string | null;
  creative_post_id: string | null;
  created_at: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-700 border-slate-300',
  Medium: 'bg-blue-100 text-blue-700 border-blue-300',
  High: 'bg-orange-100 text-orange-700 border-orange-300',
  Urgent: 'bg-red-100 text-red-700 border-red-300',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  completed: 'bg-slate-100 text-slate-600',
};

export function MyTasks() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskUpdates, setTaskUpdates] = useState<any[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user?.id]);

  const loadTasks = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', user.id)
      .neq('status', 'completed')
      .order('due_date', { ascending: true, nullsFirst: false });
    setTasks(data || []);
    setLoading(false);
  };

  const loadTaskUpdates = async (taskId: string) => {
    const { data } = await supabase
      .from('task_updates')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    setTaskUpdates(data || []);
  };

  const handleMarkDone = async (taskId: string) => {
    if (!user) return;
    await supabase.from('tasks').update({ status: 'done' }).eq('id', taskId);

    const task = tasks.find(t => t.id === taskId);
    // Notify Hamdi
    await supabase.from('notifications').insert({
      user_id: '1',
      title: '🏁 Task Done — Review Required',
      message: `${user.name} marked task "${task?.title}" as done. Please review and confirm.`,
      type: 'info',
      link: '/admin/tasks',
    });

    loadTasks();
    setSelectedTask(null);
  };

  const handleAddUpdate = async (taskId: string) => {
    if (!newUpdate.trim() || !user) return;
    await supabase.from('task_updates').insert({
      task_id: taskId,
      user_id: user.id,
      message: newUpdate.trim(),
    });

    // Notify Hamdi of update
    await supabase.from('notifications').insert({
      user_id: '1',
      title: '💬 Task Update',
      message: `${user.name} added an update to a task.`,
      type: 'info',
      link: '/admin/tasks',
    });

    setNewUpdate('');
    loadTaskUpdates(taskId);
  };

  const isOverdue = (dueDate: string | null) =>
    dueDate ? new Date(dueDate) < new Date() : false;

  if (loading) return <div className="text-slate-500 text-sm">Loading tasks...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">My Tasks</h2>
        <span className="text-sm text-slate-500">{tasks.length} active</span>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-slate-600 font-semibold">No active tasks</p>
          <p className="text-slate-400 text-sm">You're all caught up!</p>
        </div>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-slate-50"
              onClick={() => {
                setSelectedTask(selectedTask?.id === task.id ? null : task);
                if (selectedTask?.id !== task.id) loadTaskUpdates(task.id);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {isOverdue(task.due_date) && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        ⚠️ Overdue
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{task.description}</p>
                  )}
                  {task.due_date && (
                    <p className={`text-xs mt-1 ${isOverdue(task.due_date) ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                      📅 Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className="text-slate-400 ml-2">{selectedTask?.id === task.id ? '▼' : '▶'}</span>
              </div>
            </div>

            {selectedTask?.id === task.id && (
              <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                {task.description && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Task Details:</p>
                    <p className="text-sm text-slate-800">{task.description}</p>
                  </div>
                )}

                {/* Updates */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Updates:</p>
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {taskUpdates.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No updates yet</p>
                    ) : (
                      taskUpdates.map(u => (
                        <div key={u.id} className="bg-white p-2 rounded border border-slate-200">
                          <p className="text-xs text-slate-400">{new Date(u.created_at).toLocaleString()}</p>
                          <p className="text-sm text-slate-800">{u.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUpdate}
                      onChange={e => setNewUpdate(e.target.value)}
                      placeholder="Add an update for Hamdi..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      onKeyDown={e => e.key === 'Enter' && handleAddUpdate(task.id)}
                    />
                    <button
                      onClick={() => handleAddUpdate(task.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {task.status !== 'done' && (
                  <button
                    onClick={() => handleMarkDone(task.id)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    🏁 Mark as Done
                  </button>
                )}
                {task.status === 'done' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-green-700 text-sm font-semibold">
                    ✅ Marked done — waiting for Hamdi to confirm
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
