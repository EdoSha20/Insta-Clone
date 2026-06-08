<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	let uploading = $state(false);
</script>

<svelte:head>
	<title>Dashboard – Instavibe</title>
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">

	<div class="max-w-5xl mx-auto px-6 py-12">

		<div class="mb-10">
			<h1 class="text-4xl font-bold mb-2">
				Dashboard
			</h1>

			<p class="text-[#666]">
				Willkommen zurück, @{data.user.username}
			</p>
		</div>

		{#if form?.error}
			<div class="mb-6 bg-red-950/50 border border-red-900 rounded-xl p-4 text-red-400">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 bg-green-950/50 border border-green-900 rounded-xl p-4 text-green-400">
				Image uploaded successfully ✓
			</div>
		{/if}

		<section class="bg-[#111] border border-[#222] rounded-2xl p-6 mb-10">

			<h2 class="text-xl font-bold mb-5">
				Upload Image
			</h2>

			<form
				method="POST"
				action="?/upload"
				enctype="multipart/form-data"
				use:enhance={() => {
					uploading = true;

					return async ({ update }) => {
						uploading = false;
						await update();
					};
				}}
				class="space-y-4"
			>

				<label
					class="block border-2 border-dashed border-[#333] hover:border-[#7B2FBE]
					rounded-2xl p-10 text-center cursor-pointer transition"
				>

					<div class="text-5xl mb-3">
						📸
					</div>

					<p class="font-medium">
						Choose an image
					</p>

					<p class="text-[#666] text-sm mt-1">
						JPG, PNG, WEBP
					</p>

					<input
						type="file"
						name="image"
						accept="image/*"
						required
						class="hidden"
					/>

				</label>

				<textarea
					name="description"
					rows="3"
					placeholder="Description..."
					class="w-full bg-[#181818] border border-[#2A2A2A]
					rounded-xl p-4 resize-none focus:outline-none
					focus:border-[#7B2FBE]"
				></textarea>

				<button
					type="submit"
					disabled={uploading}
					class="bg-[#7B2FBE] hover:bg-[#9333EA]
					disabled:opacity-50 px-6 py-3 rounded-xl font-semibold"
				>
					{uploading ? 'Uploading...' : 'Upload'}
				</button>

			</form>

		</section>

		<div class="flex items-center justify-between mb-6">

			<h2 class="text-2xl font-bold">
				Your Images
			</h2>

			<span class="text-[#666]">
				{data.images.length} Images
			</span>

		</div>

		{#if data.images.length === 0}

			<div class="bg-[#111] border border-[#222] rounded-2xl p-16 text-center">

				<div class="text-5xl mb-4">
					📷
				</div>

				<p class="text-[#888]">
					You haven't uploaded any images yet.
				</p>

			</div>

		{:else}

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

				{#each data.images as img (img.id)}

					<div
						class="group bg-[#111] border border-[#222]
						rounded-2xl overflow-hidden"
					>

						<div class="relative">

							<img
								src={img.image}
								alt={img.description || 'image'}
								class="w-full h-64 object-cover"
							/>

							<div
								class="absolute top-3 right-3
								bg-black/70 backdrop-blur-sm
								rounded-full px-3 py-1 text-sm"
							>
								❤️ {img.votes}
							</div>

						</div>

						<div class="p-4">

							<p class="text-sm text-[#ddd] mb-4 line-clamp-2">
								{img.description || 'No description'}
							</p>

							<div class="flex gap-2">

								<a
									href={resolve(`/images/${img.id}`)}
									data-sveltekit-reload
									class="flex-1 text-center bg-[#222]
									hover:bg-[#333] py-2 rounded-lg text-sm"
								>
									View
								</a>

								<form
									method="POST"
									action="?/delete"
									class="flex-1"
								>

									<input
										type="hidden"
										name="imageId"
										value={img.id}
									/>

									<button
										type="submit"
										class="w-full bg-red-600 hover:bg-red-500
										py-2 rounded-lg text-sm"
									>
										Delete
									</button>

								</form>

							</div>

						</div>

					</div>

				{/each}

			</div>

		{/if}

	</div>

</section>