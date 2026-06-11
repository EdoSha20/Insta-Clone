<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white flex flex-col">

	<!-- HEADER (nur Info) -->
	<header class="border-b border-[#222]">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

			<!-- BRAND -->
			<div class="text-xl font-bold">
				Instavibe
			</div>

			<!-- INFO TEXT -->
			<div class="text-xs text-[#666] tracking-wide">
				Share your moments • Community driven image platform
			</div>

		</div>
	</header>

	<!-- PAGE -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- FOOTER -->
	<footer class="border-t border-[#222]">
		<div class="max-w-6xl mx-auto px-6 py-6 text-sm text-[#666] flex justify-between">

			<span>© {new Date().getFullYear()} Instavibe</span>

			<span class="text-xs text-[#555]">
				Built for learning & creativity
			</span>

		</div>
	</footer>

</section>