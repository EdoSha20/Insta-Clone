<script>
	let { data } = $props();

	const profileUser = data.profileUser;
	const images = data.images;
</script>

<svelte:head>
	<title>@{profileUser.username} – Instavibe</title>
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white">

	<div class="max-w-5xl mx-auto px-6 pt-6">

		<!-- HOME BUTTON -->
		<a href="/" class="text-sm text-zinc-400 hover:text-white">
			← Back to Home
		</a>

		<!-- PROFILE -->
		<div class="bg-[#111] border border-[#222] rounded-2xl p-8 mt-6 mb-10">

			<div class="flex items-center gap-5">

				<div class="w-14 h-14 rounded-xl bg-[#7B2FBE] flex items-center justify-center font-bold">
					{profileUser.username[0].toUpperCase()}
				</div>

				<div>
					<h1 class="text-xl font-bold">@{profileUser.username}</h1>
					<p class="text-sm text-[#666]">
						Member since {new Date(profileUser.created_at).toLocaleDateString()}
					</p>
				</div>

			</div>

		</div>

		{#if images.length === 0}

			<p class="text-center text-[#666] py-20">No posts yet</p>

		{:else}

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

				{#each images as img (img.id)}

					<a
						href={`/image/${img.id}`}
						class="block bg-[#111] border border-[#222] rounded-xl overflow-hidden"
					>

						<img
							src={img.image}
							alt={img.description || 'image'}
							class="w-full h-64 object-cover"
						/>

						<div class="p-4">

							{#if img.description}
								<p class="text-sm mb-2">{img.description}</p>
							{/if}

							<div class="flex justify-between text-xs text-[#777]">
								<span>{new Date(img.created_at).toLocaleDateString()}</span>
								<span>♥ {img.votes}</span>
							</div>

						</div>

					</a>

				{/each}

			</div>

		{/if}

	</div>

</section>