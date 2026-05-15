# Plan de Migración: Python -> TypeScript

Este plan detalla los pasos para migrar el proyecto `notes-cli` de Python a TypeScript, manteniendo la funcionalidad y el proceso SDD (Spec Driven Development).

## 1. Configuración del Entorno (Node.js)
- [ ] Inicializar `package.json`.
- [ ] Instalar dependencias:
  - `typescript` (dev)
  - `tsx` (para ejecutar TS directamente)
  - `vitest` (para tests)
  - `commander` (para el CLI)
  - `@types/node` (dev)
- [ ] Configurar `tsconfig.json`.

## 2. Migración de Código (src/)
- [ ] `src/notes.ts`: Definición de la interfaz `Note` y lógica de creación.
- [ ] `src/storage.ts`: Lógica de lectura/escritura atómica en JSON usando `fs/promises`.
- [ ] `src/cli.ts`: Implementación de los comandos CLI con `commander`.

## 3. Migración de Tests (tests/)
- [ ] `tests/storage.test.ts`: Reemplazo de `test_storage.py`.
- [ ] `tests/notes.test.ts`: Reemplazo de `test_notes.py`.
- [ ] `tests/cli.test.ts`: Reemplazo de `test_cli.py`.

## 4. Actualización del Arnés (Docs & Scripts)
- [ ] `init.sh`: Actualizar para validar `node`, `npm` y ejecutar `vitest`.
- [ ] `feature_list.json`: Actualizar descripciones y ejemplos de comandos (ej. `python -m src.cli` -> `npx tsx src/cli.ts`).
- [ ] `docs/*.md`: Revisar y actualizar referencias a Python.

## 5. Limpieza
- [ ] Eliminar archivos `.py`.
- [ ] Eliminar directorios `__pycache__`.
- [ ] Asegurar que `./init.sh` pase al 100%.
