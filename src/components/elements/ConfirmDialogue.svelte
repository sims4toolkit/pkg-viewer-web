<script lang="ts">
  import Modal from "components/layout/Modal.svelte";
  import SectionHeader from "./SectionHeader.svelte";

  export let title: string;
  export let description: string;
  export let confirmText: string = "Confirm";
  export let cancelText: string = "Cancel";
  export let onConfirm: () => void;
  export let onCancel: () => void;
</script>

<Modal>
  <div
    class="w-full max-w-lg mx-2 my-8 p-4 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl drop-shadow-md flex flex-col gap-4"
  >
    <div>
      <SectionHeader {title}></SectionHeader>
    </div>
    <p>{description}</p>
    <div class=" flex justify-end gap-4">
      <button
        on:click={onConfirm}
        class="px-3 py-1 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        >{confirmText}</button
      >
      <button
        on:click={onCancel}
        class="px-3 py-1 rounded border border-solid border-gray-800 hover:border-red-600 dark:hover:border-red-400 text-gray-800 hover:bg-red-600 hover:text-white dark:border-white dark:text-white dark:hover:bg-red-400 dark:hover:text-gray-800"
        >{cancelText}</button
      >
    </div>
  </div>
</Modal>
