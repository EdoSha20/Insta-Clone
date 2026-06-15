<script>
	let { data } = $props();
	import { resolve } from '$app/paths';
</script>

<section class="min-h-screen bg-[#0A0A0A] text-white">
	<div class="max-w-3xl mx-auto px-6 py-10">

		<!-- BACK BUTTON -->
		<a
	href={resolve(`/profile/${data.profileUser.username}`)}
	class="inline-block mb-6 px-4 py-2 bg-[#222] hover:bg-[#333] rounded-xl text-sm transition"
>
	← Back to Profile
</a>

		<h1 class="text-2xl font-bold mb-6">
			Followers of @{data.profileUser.username}
		</h1>

		{#if data.followers.length === 0}
			<p class="text-zinc-500">No followers yet</p>
		{:else}

			<div class="space-y-3">

				{#each data.followers as f (f.id)}
					<div class="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-[#222]">

						<a href={resolve(`/profile/${f.username}`)} class="flex items-center gap-3">

							{#if f.avatar}
								<img
									src={f.avatar}
									alt={f.username}
									class="w-10 h-10 rounded-lg object-cover"
								/>
							{:else}
								<div class="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center">
									{f.username[0].toUpperCase()}
								</div>
							{/if}

							<span>@{f.username}</span>

						</a>

					</div>
				{/each}

			</div>

		{/if}

	</div>
</section>