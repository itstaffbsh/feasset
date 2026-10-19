<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <PwaInstallPrompt />
    </ClientOnly>
  </div>
</template>
