# Review — feature #6 `cli_edit`

**Veredicto:** APPROVED

## Criterios de aceptación

- [x] `--title` solo actualiza solo el título → `test_edit_updates_only_title`
      (verifica `notes[0]["title"] == "nuevo"` y `body == "cuerpo"`).
- [x] `--body` solo actualiza solo el cuerpo → `test_edit_updates_only_body`
      (verifica que el title se preserva).
- [x] Ambos flags actualizan ambos campos → `test_edit_updates_both_fields`.
- [x] Sin flags → exit ≠ 0 + mensaje claro → `test_edit_without_flags_returns_error`
      (asserta `code != 0`, `out == ""`, `err != ""`, y además que la nota no
      cambió en disco). Mensaje en `cli.py:61`: `"debes pasar --title y/o --body"`.
- [x] Id inexistente → exit ≠ 0 + mensaje en stderr → `test_edit_missing_id_returns_error`
      (asserta `code != 0`, `out == ""`, `"99" in err`).
- [x] Cobertura: 4 escenarios + ausencia de flags = 5 tests `test_edit_*`.

## Arquitectura (`docs/architecture.md`)

- [x] Capas respetadas. `cmd_edit` solo usa `storage` y `notes`. No toca
      `storage.py` ni `notes.py`.
- [x] Sin dependencias externas. No existe `requirements.txt`. `cli.py` solo
      importa `argparse`, `sys`, `src.storage`, `src.notes`.
- [x] Errores explícitos. `NoteError` para "sin flags" y `NoteNotFound` para
      id inexistente. Ambos se capturan en el handler de `main()`.
- [x] Inmutabilidad de `Note`. `cli.py:65-70` construye una nueva instancia
      `Note(...)` con `id` y `created_at` preservados; no muta la original.
- [x] Atomicidad. `storage.py` intacto; `cmd_edit` llama a `storage.save()`
      sin alterar su contrato.

## Convenciones (`docs/conventions.md`)

- [x] PEP 8, líneas ≤ 100 chars (verificado con regex `^.{101,}` → 0 matches
      en `src/cli.py` y `tests/test_cli.py`).
- [x] Comillas dobles consistentes.
- [x] f-strings (`f"editada id={args.id}"`, `f"no existe la nota con id={args.id}"`).
- [x] Sin comentarios decorativos, sin TODO/FIXME (grep en `src/` → 0 matches).
- [x] Nombres correctos: `cmd_edit` (snake_case), preserva el patrón de
      `cmd_add`, `cmd_show`, etc.
- [x] `stderr` + exit 1 para errores del dominio: el handler de `main()`
      (cli.py:116-118) captura `NoteError` (clase base de `NoteNotFound`),
      imprime a `sys.stderr` y devuelve 1.

## Verificación (`docs/verification.md`)

- [x] Tests usan `tempfile.TemporaryDirectory()` (heredado del setUp de
      `TestCli`, líneas 16-17).
- [x] No mocks de filesystem. Solo se mockea la constante
      `DEFAULT_NOTES_PATH` con `patch.object`, lo cual es legítimo.
- [x] Tests verifican output concreto: contenido de `notes[0]["title"]`,
      `notes[0]["body"]`, `id=1` en stdout, `"99"` en stderr, etc. No hay
      asserts de "no lanza excepción".

## CHECKPOINTS.md

- [x] C1 — Arnés completo. `./init.sh` exit 0; los 4 archivos base y los 3
      docs existen.
- [x] C2 — Estado coherente. 0 features en `in_progress` en
      `feature_list.json` (feature #6 = `done`). Todas las features `done`
      tienen tests verdes. `progress/current.md` describe la sesión activa.
- [x] C3 — Arquitectura. `src/` solo contiene `cli.py`, `notes.py`,
      `storage.py`, `__init__.py`. No hay `requirements.txt`. No hay prints
      de debug ni TODOs.
- [x] C4 — Verificación real. Cada módulo de `src/` tiene su test;
      `tempfile.TemporaryDirectory()` en uso; 22 tests verdes.
- [x] C5 — Sesión cerrada bien. No hay archivos `*.tmp` ni `__pycache__`
      sin trackear sospechosos. La feature #6 está reflejada como `done`.
      Nota menor: `progress/history.md` aún no tiene la entrada de la
      sesión #6, pero por convención el historial se añade al cerrar
      sesión, no al cerrar feature; el leader debería añadirla antes
      del cierre final.

## Salida final de `./init.sh`

```
── 4. Ejecutando tests ─────────────────────────────────
test_add_creates_note_and_prints_id (test_cli.TestCli.test_add_creates_note_and_prints_id) ... ok
test_delete_missing_id_returns_error (test_cli.TestCli.test_delete_missing_id_returns_error) ... ok
test_delete_removes_note_and_confirms (test_cli.TestCli.test_delete_removes_note_and_confirms) ... ok
test_edit_missing_id_returns_error (test_cli.TestCli.test_edit_missing_id_returns_error) ... ok
test_edit_updates_both_fields (test_cli.TestCli.test_edit_updates_both_fields) ... ok
test_edit_updates_only_body (test_cli.TestCli.test_edit_updates_only_body) ... ok
test_edit_updates_only_title (test_cli.TestCli.test_edit_updates_only_title) ... ok
test_edit_without_flags_returns_error (test_cli.TestCli.test_edit_without_flags_returns_error) ... ok
test_list_empty_outputs_nothing (test_cli.TestCli.test_list_empty_outputs_nothing) ... ok
test_list_shows_existing_notes (test_cli.TestCli.test_list_shows_existing_notes) ... ok
test_search_finds_matching_notes (test_cli.TestCli.test_search_finds_matching_notes) ... ok
test_search_is_case_insensitive (test_cli.TestCli.test_search_is_case_insensitive) ... ok
test_search_no_match_returns_error (test_cli.TestCli.test_search_no_match_returns_error) ... ok
test_show_missing_id_returns_error (test_cli.TestCli.test_show_missing_id_returns_error) ... ok
test_show_prints_title_date_body (test_cli.TestCli.test_show_prints_title_date_body) ... ok
test_new_assigns_id_one_when_no_existing (test_notes.TestNote.test_new_assigns_id_one_when_no_existing) ... ok
test_new_increments_id (test_notes.TestNote.test_new_increments_id) ... ok
test_note_is_frozen (test_notes.TestNote.test_note_is_frozen) ... ok
test_to_dict_round_trip (test_notes.TestNote.test_to_dict_round_trip) ... ok
test_load_returns_empty_when_file_missing (test_storage.TestStorage.test_load_returns_empty_when_file_missing) ... ok
test_save_is_atomic (test_storage.TestStorage.test_save_is_atomic) ... ok
test_save_then_load_roundtrip (test_storage.TestStorage.test_save_then_load_roundtrip) ... ok

----------------------------------------------------------------------
Ran 22 tests in 0.020s

OK
[OK]    Todos los tests pasan

── 5. Resumen ──────────────────────────────────────────
[OK]    Entorno listo. Puedes empezar a trabajar.
```

22 tests verdes, coincide con el reporte del implementer (17 previos + 5 nuevos).

## Cierre

La feature #6 `cli_edit` cumple literalmente los 6 criterios de aceptación,
respeta la arquitectura, las convenciones y el protocolo de verificación.
La marca `status: "done"` en `feature_list.json` es legítima y puede
mantenerse. Recomendación menor (no bloqueante) al leader: añadir entrada
de la sesión en `progress/history.md` antes de cerrar la sesión.
