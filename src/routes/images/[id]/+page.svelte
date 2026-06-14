<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data } = $props();

	let commentText = $state('');
	let editing = $state(false);

	// ESLint-friendly (kein $effect mehr)
	let description = $derived(data.image.description);
</script>

<div class="min-h-screen bg-[#070710] text-white px-6 py-10">

	<!-- BACK -->
	<a
		href={resolve('/')}
		class="text-zinc-400 hover:text-white text-sm"
	>
		← Back to home
	</a>

	<!-- IMAGE -->
	<div class="max-w-3xl mx-auto mt-6">

		<img
			src={data.image.image}
			alt={data.image.description || 'Post image'}
			class="rounded-2xl w-full border border-[#1e1e2e]"
		/>

		<div class="flex justify-between items-start mt-4">

			<div>
				<p class="text-sm text-zinc-400">
					@{data.image.author}
				</p>

				{#if !editing}
					<p class="text-zinc-300 mt-1">
						{description}
					</p>

					{#if data.user?.id === data.image.author_id}
						<button
							onclick={() => (editing = true)}
							class="text-xs text-zinc-500 hover:text-white mt-1"
						>
							Edit
						</button>
					{/if}
				{:else}
					<form
						method="POST"
						action="?/edit"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								editing = false;
								invalidateAll();
							};
						}}
						class="mt-2 flex flex-col gap-2"
					>
						<textarea
							name="description"
							value={data.image.description}
							class="bg-[#111120] border border-[#1e1e2e] rounded-xl px-3 py-2 text-white"
						></textarea>

						<div class="flex gap-2">
							<button
								type="submit"
								class="bg-violet-600 hover:bg-violet-500 px-4 py-1 rounded-xl text-sm"
							>
								Save
							</button>

							<button
								type="button"
								onclick={() => (editing = false)}
								class="text-zinc-400 hover:text-white text-sm"
							>
								Cancel
							</button>
						</div>
					</form>
				{/if}
			</div>

			<!-- VOTE -->
			<form
				method="POST"
				action="?/vote"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						invalidateAll();
					};
				}}
			>
				<button
					disabled={data.hasVoted}
					class="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 px-4 py-2 rounded-xl"
				>
					❤️ {data.image.votes}
				</button>
			</form>

		</div>

		<!-- COMMENTS -->
		<div class="mt-10">

			<h2 class="text-lg font-bold mb-4">
				Comments
			</h2>

			<form
				method="POST"
				action="?/comment"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						commentText = '';
						invalidateAll();
					};
				}}
				class="flex gap-2 mb-6"
			>
				<input
					name="text"
					bind:value={commentText}
					class="flex-1 bg-[#111120] border border-[#1e1e2e] rounded-xl px-3 py-2"
					placeholder="Write comment..."
				/>

				<button
					type="submit"
					class="bg-violet-600 px-4 rounded-xl"
				>
					Send
				</button>
			</form>

			{#each data.comments as c (c.id)}
				<div class="bg-[#111120] border border-[#1e1e2e] p-3 rounded-xl mb-2">
					<p class="text-sm text-zinc-400">
						@{c.username}
					</p>
					<p>{c.text}</p>
				</div>
			{/each}

			{#if data.comments.length === 0}
				<p class="text-zinc-500">
					No comments yet
				</p>
			{/if}

		</div>

	</div>

</div>