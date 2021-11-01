"use client";
import * as Dialog from "@radix-ui/react-dialog";

export function SourceViewDialog({ source }: { source: object }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>src</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-0 left-0 right-0 bottom-0 grid place-items-center px-4">
          <Dialog.Content className="bg-white border w-full">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(source, null, 2)}
            </pre>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
