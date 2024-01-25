import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['./dados_postgres', './node_modules']
  }
})
