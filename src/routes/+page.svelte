<script>
	let { data } = $props();
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Instavibe – Feed</title>
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">

	<!-- Background blobs -->
	<div
		class="absolute w-125 h-125 -top-40 -right-40 opacity-40 blur-[90px] bg-[#3D0066]"
		style="border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;"
	></div>

	<div
		class="absolute w-100 h-100 -bottom-40 -left-40 opacity-50 blur-[80px] bg-[#00204A]"
		style="border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;"
	></div>


	<div class="max-w-6xl mx-auto px-6 pt-16 pb-10 relative">


		<!-- HEADER -->
		<div class="flex items-start justify-between mb-10">

			<div>

				<div class="inline-flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-full px-4 py-2 mb-6">

					<div class="w-2 h-2 rounded-full bg-[#A855F7]"></div>

					<span class="text-xs text-[#777] tracking-widest uppercase">
						Community Feed
					</span>

				</div>


				<h1 class="text-4xl md:text-5xl font-bold leading-tight">
					Discover <span class="text-[#A855F7]">instavibe</span> moments
				</h1>


				<p class="text-[#666] mt-3 max-w-md">
					Photos shared by the community, ranked by votes.
				</p>

			</div>



			{#if !data.user}

				<div class="flex items-center gap-3">

					<a
						href={resolve('/login')}
						class="px-4 py-2 rounded-[10px] border border-[#222] bg-[#111111] text-[#aaa] hover:text-white hover:border-[#444] transition text-sm">
						Login
					</a>


					<a
						href={resolve('/register')}
						class="px-4 py-2 rounded-[10px] bg-[#7B2FBE] hover:bg-[#9333EA] text-white text-sm font-semibold transition">
						Register
					</a>

				</div>


			{:else}

				<div class="flex items-center gap-3">

					<a
						href={resolve('/dashboard')}
						class="px-4 py-2 rounded-[10px] bg-[#7B2FBE] hover:bg-[#9333EA] text-white text-sm font-semibold transition">
						Dashboard
					</a>


					<a
						href={resolve(`/profile/${data.user.username}`)}
						class="px-4 py-2 rounded-[10px] border border-[#222] bg-[#111111] text-[#aaa] hover:text-white hover:border-[#444] transition text-sm">
						Profile
					</a>

				</div>

			{/if}

		</div>



		<!-- EMPTY -->

		{#if data.images.length === 0}


			<div class="bg-[#111111] border border-[#222222] rounded-[20px] p-10 text-center">


				<div class="w-14 h-14 mx-auto mb-4 rounded-[14px] bg-[#181818] flex items-center justify-center">
					📸
				</div>


				<h2 class="text-xl font-bold mb-2">
					No images yet
				</h2>


				<p class="text-[#666] mb-6">
					Be the first to upload something.
				</p>


				<a
					href={resolve('/dashboard')}
					class="inline-block bg-[#7B2FBE] hover:bg-[#9333EA] px-6 py-3 rounded-[10px] font-semibold transition">
					Upload Image
				</a>


			</div>



		{:else}



			<!-- GRID -->

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">


				{#each data.images as img (img.id)}


					<div
						class="group bg-[#111111] border border-[#222222] rounded-[18px] overflow-hidden hover:border-[#7B2FBE]/50 transition">


						<a href={resolve(`/images/${img.id}`)}>


							<div class="overflow-hidden">

								<img
									src={img.image}
									alt={img.description || 'Image'}	
									class="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
								/>

							</div>


						</a>



						<div class="p-4">


							{#if img.description}

								<p class="text-sm text-white mb-3 line-clamp-2">
									{img.description}
								</p>

							{/if}



							<div class="flex items-center justify-between">


								<span class="text-xs text-[#777]">
									@{img.author}
								</span>



								<div class="flex items-center gap-2">


									<div class="flex items-center gap-1 bg-[#181818] border border-[#222] px-3 py-1 rounded-full">

										<span class="text-[#A855F7] text-xs">
											♥
										</span>


										<span class="text-xs font-semibold">
											{img.votes}
										</span>

									</div>



									{#if data.user}


										<form method="POST" action="?/save">

											<input 
												type="hidden" 
												name="imageId" 
												value={img.id} 
											/>


											<button
												class="bg-[#181818] border border-[#222] px-3 py-1 rounded-full text-xs hover:border-[#7B2FBE] transition">

												🔖

											</button>

										</form>



										<form method="POST" action="?/unsave">

											<input 
												type="hidden" 
												name="imageId" 
												value={img.id} 
											/>


											<button
												class="bg-[#181818] border border-[#222] px-3 py-1 rounded-full text-xs hover:border-[#7B2FBE] transition">

												✕

											</button>

										</form>


									{/if}


								</div>


							</div>


						</div>


					</div>



				{/each}


			</div>



		{/if}



	</div>


</section>