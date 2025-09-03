<script lang="ts">
	import type { contactType } from '$lib/mail_sender';
  import {
    Mail,
    Search,
    Filter,
    ChevronDown,
    ChevronRight,
    Reply,
    Send,
    CheckCircle2,
    Eye,
    Trash2,
    MailOpen,
    Mail as MailIcon,
  } from 'lucide-svelte';


  interface ContactMessage extends contactType {
    id: string;
    receivedAt: string;
    read: boolean;
    replied?: boolean;
    replyHistory?: { date: string; content: string }[];
  }

  type StatusFilter = 'All' | 'Unread' | 'Read' | 'Replied';

  let { data } = $props()
  let searchTerm = $state('');
  let statusFilter: StatusFilter = $state('All');
  let expanded: Record<string, boolean> = $state({});
  let draftReplies: Record<string, string> = $state({});
    let selectedMessage: ContactMessage | null = $state(null)

  let messages: ContactMessage[] = $derived(
    (data?.contact ?? []).map((m: any) => ({
      id: m.id,
      name: m.name,
      services: m.services,
      email: m.email,
      subject: m.subject,
      message: m.message,
      receivedAt: m.createdAt,   // map createdAt → receivedAt
      read: m.isread,            // map isread → read
      replied: false,            // default until replies are stored
      replyHistory: [],          // empty until replies exist
    }))
  )

  // derived filtered messages
  let filteredMessages = $derived(
    messages.filter((m) => {
      const haystack = `${m.name} ${m.email} ${m.subject} ${m.message ?? ''} ${m.services ?? ''}`.toLowerCase()
      const matchesSearch = haystack.includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Unread' && !m.read) ||
        (statusFilter === 'Read' && m.read) ||
        (statusFilter === 'Replied' && m.replied === true)
      return matchesSearch && matchesStatus
    })
  )


  function toggleExpand(id: string) {
    expanded = { ...expanded, [id]: !expanded[id] };
  }

  function openMessageModal(m: ContactMessage) {
    selectedMessage = m
    // mark as read when opened
    messages = messages.map((msg) =>
      msg.id === m.id ? { ...msg, read: true } : msg
    )
  }

  function closeMessageModal() {
    selectedMessage = null
  }

  function handleDelete(id: string) {
    if (confirm('Delete this message?')) {
      messages = messages.filter((m) => m.id !== id);
    }
  }

  function handleSendReply(id: string) {
    const content = draftReplies[id]?.trim();
    if (!content) return;
    messages = messages.map((m) =>
      m.id === id
        ? {
            ...m,
            read: true,
            replied: true,
            replyHistory: [...(m.replyHistory ?? []), { date: new Date().toISOString(), content }],
          }
        : m
    );
    draftReplies = { ...draftReplies, [id]: '' };
  }

  function setReadAll() {
    messages = messages.map((m) => ({ ...m, read: true }));
  }

  function messageStatusBadge(m: ContactMessage) {
    if (m.replied)
      return `<span class="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700">Replied</span>`;
    if (m.read)
      return `<span class="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700">Read</span>`;
    return `<span class="px-2.5 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Unread</span>`;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
    <div>
      <h1 class="text-2xl font-cabinet font-medium text-brand-grey-500">Contact Messages</h1>
      <p class="text-brand-grey-400 font-synonym">View, reply, and manage contact form messages</p>
    </div>
    <div class="flex items-center gap-3">
      <button
        onclick={setReadAll}
        class="flex items-center gap-2 bg-brand-blue-500 text-white px-4 py-2 rounded-lg text-sm font-synonym hover:bg-brand-blue-500/90 transition-colors"
      >
        <CheckCircle2 size={16} />
        Mark all as read
      </button>
    </div>
  </div>

  <!-- Search + Filter -->
  <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search messages..."
          bind:value={searchTerm}
          class="w-full pl-10 pr-4 py-2 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
        />
      </div>

      <div class="flex items-center gap-2">
        <Filter class="text-brand-grey-400 h-4 w-4" />
        <select
          bind:value={statusFilter}
          class="border border-brand-grey-50 rounded-lg px-3 py-2 font-synonym text-brand-grey-500 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
        >
          <option value="All">All</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
          <option value="Replied">Replied</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Messages list -->
  <div class="bg-white rounded-xl border border-brand-grey-50 overflow-hidden">
    <div class="bg-bg-blue px-6 py-4 border-b border-brand-grey-50">
      <div class="flex items-center justify-between">
        <span class="text-sm font-synonym font-medium text-brand-grey-500">{filteredMessages.length} Messages</span>
      </div>
    </div>

    <div class="divide-y divide-brand-grey-50">
      {#if filteredMessages.length === 0}
        <div class="p-12 text-center">
          <MailIcon class="mx-auto h-12 w-12 text-brand-grey-200 mb-4" />
          <h3 class="text-lg font-cabinet font-medium text-brand-grey-500 mb-2">No messages found</h3>
          <p class="text-brand-grey-400 font-synonym">Try different search or filter criteria</p>
        </div>
      {:else}
        {#each filteredMessages as m (m.id)}
          <div class="p-0">
            <!-- Row -->
            <div class="p-6 hover:bg-bg-blue transition-colors">
              <div class="flex items-start gap-4">
                <button
                  class="mt-1 p-1 rounded-lg text-brand-grey-400 hover:text-brand-grey-600 hover:bg-brand-grey-50"
                  onclick={() => toggleExpand(m.id)}
                >
                  {#if expanded[m.id]}
                    <ChevronDown size={18} />
                  {:else}
                    <ChevronRight size={18} />
                  {/if}
                </button>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-cabinet text-brand-grey-500">{m.name}</span>
                        <span class="text-brand-grey-300">•</span>
                        <span class="text-sm text-brand-grey-400 font-synonym">{m.email}</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs text-brand-grey-400 font-synonym mb-2">
                        {#if m.services}
                          <span class="bg-brand-grey-50 text-brand-grey-500 px-2 py-1 rounded-full">{m.services}</span>
                        {/if}
                        <span class="flex items-center gap-1"><Eye size={12} /> {new Date(m.receivedAt).toLocaleString()}</span>
                      </div>
                      <p class="text-sm font-synonym text-brand-grey-500 {expanded[m.id] ? '' : 'line-clamp-1'}">{m.subject}</p>
                    </div>

                    <div class="flex items-center gap-2">
                      {@html messageStatusBadge(m)}
                      <button
                        onclick={() => openMessageModal(m)}
                        class="p-2 text-brand-grey-400 hover:text-brand-blue-500 hover:bg-brand-blue-50 rounded-lg transition-colors"
                      >
                        <MailOpen size={16} />
                      </button>
                      <button
                        onclick={() => toggleExpand(m.id)}
                        class="p-2 text-brand-grey-400 hover:text-brand-blue-500 hover:bg-brand-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onclick={() => handleDelete(m.id)}
                        class="p-2 text-brand-grey-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Expanded details -->
            {#if expanded[m.id]}
              <div class="px-6 pb-6">
                <div class="rounded-xl border border-brand-grey-50 bg-bg-blue">
                  <div class="p-4">
                    <h4 class="font-cabinet text-brand-grey-500 mb-2">Message</h4>
                    <p class="text-sm text-brand-grey-600 font-synonym whitespace-pre-wrap">
                      {m.message || 'No message body provided.'}
                    </p>
                  </div>

                  {#if m.replyHistory?.length}
                    <div class="px-4 pb-4">
                      <h4 class="font-cabinet text-brand-grey-500 mb-2">Previous Replies</h4>
                      <div class="space-y-3">
                        {#each m.replyHistory as r, idx}
                          <div class="p-3 rounded-lg bg-white border border-brand-grey-50">
                            <div class="text-xs text-brand-grey-400 font-synonym mb-1">
                              {new Date(r.date).toLocaleString()}
                            </div>
                            <div class="text-sm text-brand-grey-600 font-synonym whitespace-pre-wrap">{r.content}</div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  <!-- Reply box -->
                  <div class="p-4 border-t border-brand-grey-50 bg-white rounded-b-xl">
                    <div class="flex items-start gap-3">
                      <div class="flex-1">
                        <textarea
                          bind:value={draftReplies[m.id]}
                          placeholder={`Reply to ${m.name} (${m.email})...`}
                          class="w-full min-h-[100px] p-3 border border-brand-grey-100 rounded-lg font-synonym text-sm placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                        ></textarea>
                      </div>
                      <button
                        onclick={() => handleSendReply(m.id)}
                        disabled={!draftReplies[m.id]?.trim()}
                        class="flex items-center gap-2 bg-brand-orange-500 text-white px-4 py-2 rounded-lg text-sm font-synonym hover:bg-brand-orange-500/90 transition-colors disabled:opacity-50"
                      >
                        <Send size={16} />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

