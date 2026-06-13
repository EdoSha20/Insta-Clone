<script>
	import { resolve } from '$app/paths';

	let { data } = $props();

	const totalVotes = $derived(
		data.images.reduce(
			(sum, img) => sum + (img.votes || 0),
			0
		)
	);
</script>

<svelte:head>
	<title>@{data.profileUser.username} | ImageBlog</title>
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white">

	<div class="max-w-6xl mx-auto px-6 py-8">

		<!-- HEADER -->
		<div class="flex justify-between items-center mb-6">

		<a	
				href={resolve('/')}
				class="text-zinc-400 hover:text-white transition"
			>

				← Back to Home
			</a>

			<div class="flex gap-3">

				<a
					href={resolve('/saved')}
					class="px-4 py-2 bg-[#222] hover:bg-[#333] rounded-xl font-medium transition"
				>
					🔖 Saved
				</a>

				<a
					href={resolve('/dashboard')}
					class="px-4 py-2 bg-[#7B2FBE] hover:bg-[#9333EA] rounded-xl font-medium transition"
				>
					📸 Dashboard
				</a>

				<form method="POST" action={resolve('/logout')}>
					<button
						type="submit"
						class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-medium transition"
					>
						Logout
					</button>
				</form>

			</div>

		</div>

		<!-- PROFILE CARD -->
		<div class="bg-[#111111] border border-[#222222] rounded-3xl p-8 mb-10">

			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

				<div class="flex items-center gap-5">

					<div class="w-20 h-20 rounded-2xl bg-[#7B2FBE] flex items-center justify-center text-3xl font-bold">
						{data.profileUser.username[0].toUpperCase()}
					</div>

					<div>
						<h1 class="text-3xl font-bold">
							@{data.profileUser.username}
						</h1>

						<p class="text-zinc-500 mt-1">
							Member since {new Date(data.profileUser.created_at).toLocaleDateString()}
						</p>
					</div>

				</div>

				<div class="flex gap-8">

					<div class="text-center">
						<p class="text-2xl font-bold">
							{data.images.length}
						</p>
						<p class="text-zinc-500 text-sm">Posts</p>
					</div>

					<div class="text-center">
						<p class="text-2xl font-bold">
							{totalVotes}
						</p>
						<p class="text-zinc-500 text-sm">Likes</p>
					</div>

				</div>

			</div>

		</div>

		<!-- IMAGES GRID (FEHLTE BEI DIR!) -->
		{#if data.images.length === 0}

			<div class="bg-[#111111] border border-[#222222] rounded-2xl p-16 text-center">
				<p class="text-zinc-500">No Posts Yet</p>
			</div>

		{:else}

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

				{#each data.images as img (img.id)}
<a
					
						href={resolve(`/images/${img.id}`)}
						class="group bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#7B2FBE]/50 transition"
					>

						<img
							src={img.image}
							alt={img.description || 'Image'}
							class="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
						/>

						<div class="p-4">

							{#if img.description}
								<p class="text-zinc-300 mb-3 line-clamp-2">
									{img.description}
								</p>
							{/if}

							<div class="flex justify-between text-sm text-zinc-500">
								<span>
									{new Date(img.created_at).toLocaleDateString()}
								</span>

								<span>
									❤️ {img.votes}
								</span>
							</div>

						</div>

					</a>

				{/each}

			</div>

		{/if}

	</div>

</section>