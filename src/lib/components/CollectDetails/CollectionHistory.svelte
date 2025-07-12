<script lang="ts">
    let { collectionHistory } = $props();
</script>

<div class="space-y-3">
    {#each collectionHistory as item}
        <div class="flex items-start space-x-3 border-b border-shade-gray-100 pb-4">
            <div class="text-sm text-gray-10 min-w-0 flex-1">
                <div>{item.time}</div>
                <div>{item.status}</div>
                {#if item.info}
                    <div>{item.info}</div>
                {/if}
            </div>
        </div>
    {/each}
</div>