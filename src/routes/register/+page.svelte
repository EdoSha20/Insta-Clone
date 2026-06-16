<script>
	import { resolve } from '$app/paths';
	let { form } = $props();
</script>

<section class="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-10 overflow-hidden relative">

	<div class="absolute w-125 h-125 rounded-full -top-40 -right-30 opacity-50 blur-[80px] bg-[#3D0066]" style="border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;"></div>
	<div class="absolute w-95 h-95 rounded-full -bottom-25 -left-20 opacity-60 blur-[60px] bg-[#00204A]" style="border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;"></div>

	<div class="relative w-full max-w-sm bg-[#111111] border border-[#222222] rounded-[20px] p-9 text-white">

		<div class="flex items-center gap-3 mb-8">
			<div class="w-10 h-10 rounded-[10px] bg-[#7B2FBE] flex items-center justify-center shrink-0">
				<span class="text-lg font-black text-white">i</span>
			</div>
			<span class="text-lg font-bold tracking-tight">
				insta<span class="text-[#A855F7]">vibe</span>
			</span>
		</div>
 
		<h1 class="text-[26px] font-bold tracking-tight leading-tight mb-1">
			Join the <span class="text-[#A855F7]">vibe.</span>
		</h1>
		<p class="text-[#555555] text-sm mb-8">Create your account and start sharing.</p>

		{#if form?.error}
			<div class="mb-6 rounded-xl border border-red-900/50 bg-red-950/50 p-3 text-sm text-red-400">
				{form.error}
			</div>
		{/if}

		<form action="?/register" method="POST" class="space-y-4">

			<div>
				<label for="username" class="block mb-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#444444]">
					Username
				</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					class="w-full rounded-[10px] bg-[#181818] border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-[#333333] focus:outline-none focus:border-[#7B2FBE] transition"
					placeholder="yourname"
				/>
			</div>

			<div>
				<label for="email" class="block mb-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#444444]">
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					class="w-full rounded-[10px] bg-[#181818] border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-[#333333] focus:outline-none focus:border-[#7B2FBE] transition"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block mb-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#444444]">
					Password
				</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="w-full rounded-[10px] bg-[#181818] border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-[#333333] focus:outline-none focus:border-[#7B2FBE] transition"
					placeholder="Create a password"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-[10px] bg-[#7B2FBE] hover:bg-[#9333EA] text-white py-3 text-sm font-semibold tracking-wide transition active:scale-[0.99] mt-2"
			>
				Create account →
			</button>

		</form>

		<p class="mt-6 text-center text-[12.5px] text-[#444444]">
			Already have an account?
			<a href={resolve('/login')} class="text-[#A855F7] font-semibold hover:underline">
				Log in
			</a>
		</p>

	</div>

</section>