<script>
	let { form } = $props();
</script>
<section class="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
	<div class="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-lg">
		<h1 class="text-3xl font-bold mb-6 text-center">
			Register
		</h1>
		{#if form?.error}
			<p class="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
				{form.error}
			</p>
		{/if}
		<form action="?/register" method="POST" class="space-y-5">
			<div>
				<label for="username" class="block mb-2 text-sm">
					Username
				</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					class="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
				/>
			</div>
			<div>
				<label for="email" class="block mb-2 text-sm">
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					class="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm">
					Password
				</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
				/>
			</div>
			<button
				type="submit"
				class="w-full bg-white text-black py-3 rounded-lg font-semibold hover:opacity-80 transition"
			>
				Create Account
			</button>
		</form>
		<p class="text-center text-zinc-400 mt-6">
			Already have an account?
			<a href="/login" class="text-white hover:underline">
				Login
			</a>
		</p>
	</div>
</section>
 