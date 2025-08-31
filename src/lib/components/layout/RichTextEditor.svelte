<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import 'quill/dist/quill.snow.css';
	import { safeHTML } from '$lib/utils/safeHTML';

	type Props = {
		value?: string | null;
		readOnly?: boolean;
	};

	let {
		value = $bindable(),
		readOnly = false
	}: Props = $props();

	let editorContainer: HTMLDivElement;
	let quill: any;

	const toolbar = [
		[{ 'font': [] }],
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ 'color': [] }, { 'background': [] }],
		[{ 'script': 'sub' }, { 'script': 'super' }],
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'indent': '-1' }, { 'indent': '+1' }],
		[{ 'direction': 'rtl' }],
		[{ 'align': [] }],
		['blockquote', 'code-block'],
		['link', 'image', 'video'],
		['clean']
	];

	function onTextChange() {
		value = quill.root.innerHTML;
	}

	onMount(() => {
		if (!browser) return;

		let quillInstance: any;

		(async () => {
			const Quill = (await import('quill')).default;

			quillInstance = new Quill(editorContainer, {
				theme: 'snow',
				modules: { toolbar },
				placeholder: 'Write your article content here...',
			});

			if (value) {
				quillInstance.clipboard.dangerouslyPasteHTML(value, 'user');
			}

			quillInstance.on('text-change', onTextChange);
			quill = quillInstance;
		})();

		return () => {
			quillInstance?.off('text-change', onTextChange);
		};
	});
</script>


{#if browser}
	{#if readOnly}
		<!-- Safe HTML display -->
		<div class="quill-view" use:safeHTML={value}></div>
	{:else}
		<div bind:this={editorContainer} class="quill-editor"></div>
	{/if}
{/if}

<style>
	.quill-editor {
		min-height: 300px;
	}
</style>
