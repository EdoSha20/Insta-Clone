<script>
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Search Users | Instavibe</title>
</svelte:head>

<section class="min-h-screen bg-[#0A0A0A] text-white">

	<div class="max-w-4xl mx-auto px-6 py-10">

		<a
			href={resolve('/')}
			class="text-zinc-400 hover:text-white transition"
		>
			← Back to Home
		</a>

		<h1 class="text-3xl font-bold mt-6 mb-6">
			Search Users
		</h1>

		<form method="GET" class="mb-8">

			<input
				type="text"
				name="q"
				value={data.q}
				placeholder="Search users..."
				class="w-full bg-[#111111] border border-[#222222] rounded-xl px-4 py-3 outline-none focus:border-[#7B2FBE]"
			/>

		</form>

		{#if data.users.length > 0}

			<div class="space-y-3">

				{#each data.users as user (user.id)}

					<a
						href={resolve(`/profile/${user.username}`)}
						class="flex items-center gap-4 bg-[#111111] border border-[#222222] rounded-xl p-4 hover:border-[#7B2FBE] transition"
					>

						{#if user.avatar}

							<img
								src={user.avatar}
								alt={user.username}
								class="w-12 h-12 rounded-full object-cover"
							/>

						{:else}

							<div class="w-12 h-12 rounded-full bg-[#7B2FBE] flex items-center justify-center font-bold">
								{user.username[0].toUpperCase()}
							</div>

						{/if}

						<div>
							<p class="font-semibold">
								@{user.username}
							</p>
						</div>

					</a>

				{/each}

			</div>

		{:else if data.q}

			<div class="text-zinc-500">
				No users found.
			</div>

		{/if}

	</div>

</section>