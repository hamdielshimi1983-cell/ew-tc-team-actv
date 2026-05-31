'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/use-supabase';
import { BackButton } from '@/components/back-button';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  priority: string;
  status: string;
  due_date: string | null;
  creative_post_id: string | null;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

interface CreativePost {
  id: string;
  caption: string;
  status: string;
}

const USER_NAMES: Record<string, string> = {
  '1': 'Hamdi', '2': 'Hadeer', '3': 'Bakr', '4': 'Asmaa',
};

const TEAM_MEMBERS = [
  { id: '2', name: 'Hadeer', role: 'Media Buyer' },
  { id: '3', name: 'Bakr', role: 'Creator' },
  { id: '4', name: 'Asmaa', role: 'Creator' },
];

const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-700 border-slate-300',
  Medium: 'bg-blue-100 text-blue-700 border-blue-300',
  High: 'bg-orange-100 text-orange-700 border-orange-300',
  Urgent: 'bg-red-100 text-red-700 border-red-300',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
  done: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-slate-100 text-slate-800 border-slate-300',
};

export default function TasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = useSupabase();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [creatives, setCreatives] = useState<CreativePost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskUpdates, setTaskUpdates] = useState<any[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [attachedCreative, setAttachedCreative] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadTasks();
      loadCreatives();
    }
  }, [user]);

  const loadTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    setTasks(data || []);
  };

  const loadCreatives = async () => {
    const { data } = await supabase
      .from('creative_posts')
      .select('id, caption, status')
      .order('created_at', { ascending: false })
      .limit(50);
    setCreatives(data || []);
  };

  const loadTaskUpdates = async (taskId: string) => {
    const { data } = await supabase
      .from('task_updates')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    setTaskUpdates(data || []);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo || !user) return;
    setSubmitting(true);

    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          description: description.trim(),
          assigned_to: assignedTo,
          assigned_by: user.id,
          priority,
          due_date: dueDate || null,
          creative_post_id: attachedCreative || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Notify assignee
      const assigneeName = USER_NAMES[assignedTo];
      await supabase.from('notifications').insert({
        user_id: assignedTo,
        title: '📋 New Task Assigned',
        message: `Hamdi assigned you a ${priority} priority task: "${title.trim()}"${dueDate ? ` — Due: ${dueDate}` : ''}`,
        type: priority === 'Urgent' ? 'error' : priority === 'High' ? 'warning' : 'info',
        link: '/dashboard',
      });

      // Log activity
      await supabase.from('activity_logs').insert({
        action: 'task_assigned',
        actor_id: user.id,
        details: { title: title.trim(), assigned_to: assigneeName, priority },
      });

      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority('Medium');
      setDueDate('');
      setAttachedCreative('');
      setShowForm(false);
      loadTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    if (!user) return;
    await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', taskId);

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await supabase.from('notifications').insert({
        user_id: task.assigned_to,
        title: '✅ Task Marked Complete',
        message: `Hamdi marked your task "${task.title}" as complete.`,
        type: 'success',
        link: '/dashboard',
      });
    }

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
    setNewUpdate('');
    loadTaskUpdates(taskId);
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterAssignee !== 'all' && t.assigned_to !== filterAssignee) return false;
    return true;
  });

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6"><BackButton /></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Task Management</h1>
            <p className="text-slate-600 mt-1">Assign and track team tasks</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Create Task Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Fix daily budget on Campaign X"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe exactly what needs to be done..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assign To *</label>
                  <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select team member...</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🔵 Medium</option>
                    <option value="High">🟠 High</option>
                    <option value="Urgent">🔴 Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Attach Creative (optional)</label>
                  <select
                    value={attachedCreative}
                    onChange={e => setAttachedCreative(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">No creative attached</option>
                    {creatives.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.caption.substring(0, 50)}... [{c.status}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !title.trim() || !assignedTo}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
              >
                {submitting ? 'Creating...' : '📋 Create & Assign Task'}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done (awaiting review)</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterAssignee}
            onChange={e => setFilterAssignee(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="all">All Team Members</option>
            {TEAM_MEMBERS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-slate-600 flex items-center">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">No tasks found. Create one above!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setSelectedTask(selectedTask?.id === task.id ? null : task);
                    if (selectedTask?.id !== task.id) loadTaskUpdates(task.id);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[task.status]}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                            ⚠️ Overdue
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{task.title}</h3>
                      {task.description && (
                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>👤 {USER_NAMES[task.assigned_to]}</span>
                        {task.due_date && (
                          <span className={isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600 font-semibold' : ''}>
                            📅 Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span>🕐 {new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="text-slate-400">{selectedTask?.id === task.id ? '▼' : '▶'}</span>
                  </div>
                </div>

                {/* Task Detail Panel */}
                {selectedTask?.id === task.id && (
                  <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-4">
                    {task.description && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">Full Description:</p>
                        <p className="text-slate-800 text-sm bg-white p-3 rounded-lg border border-slate-200">{task.description}</p>
                      </div>
                    )}

                    {task.creative_post_id && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700">📎 Attached Creative ID: {task.creative_post_id}</p>
                      </div>
                    )}

                    {/* Updates Thread */}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Updates & Comments:</p>
                      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                        {taskUpdates.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No updates yet</p>
                        ) : (
                          taskUpdates.map(u => (
                            <div key={u.id} className="bg-white rounded-lg p-3 border border-slate-200">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-slate-700">{USER_NAMES[u.user_id] || u.user_id}</span>
                                <span className="text-xs text-slate-400">{new Date(u.created_at).toLocaleString()}</span>
                              </div>
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
                          placeholder="Add a comment or update..."
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

                    {/* Action Buttons */}
                    {task.status !== 'completed' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleMarkComplete(task.id)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          ✅ Mark Complete
                        </button>
                        {task.status === 'pending' && (
                          <button
                            onClick={async () => {
                              await supabase.from('tasks').update({ status: 'in_progress' }).eq('id', task.id);
                              loadTasks();
                            }}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            ▶ Mark In Progress
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
