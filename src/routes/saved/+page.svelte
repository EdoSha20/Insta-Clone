<script>
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<svelte:head>
	<title>Saved Posts – Instavibe</title>
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white">

	<div class="max-w-6xl mx-auto px-6 py-10">

		<!-- HEADER -->
		<div class="flex items-center justify-between mb-8">

			<div>
				<h1 class="text-3xl font-bold">🔖 Saved Posts</h1>
				<p class="text-[#666] text-sm mt-1">
					Your saved images collection
				</p>
			</div>

			<a
				href={resolve(`/profile/${data.user.username}`)}
				class="px-4 py-2 bg-[#222] hover:bg-[#333] rounded-xl text-sm transition"
			>
				← Back to Profile
			</a>

		</div>

		<!-- EMPTY STATE -->
		{#if data.posts.length === 0}

			<div class="text-center py-20 bg-[#111] border border-[#222] rounded-2xl">
				<p class="text-[#888]">No saved posts yet.</p>
			</div>

		{:else}

			<!-- GRID -->
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

				{#each data.posts as post (post.id)}

					<a
						href={resolve(`/images/${post.id}`)}
						class="group bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#7B2FBE]/40 transition"
					>

						<div class="aspect-square overflow-hidden">
							<img
								src={post.image}
								alt={post.description || 'saved image'}
								class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
							/>
						</div>

						<div class="p-3">
							<p class="text-xs text-[#777] line-clamp-1">
								{post.description || 'No description'}
							</p>
						</div>

					</a>

				{/each}

			</div>

		{/if}

	</div>

</section>