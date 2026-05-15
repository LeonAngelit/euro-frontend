# Informe del implementer — Feature #6 `cli_edit`

## Archivos modificados

- `src/cli.py` — añadido `cmd_edit` (load → mutar → save → print) y subparser
  `edit` con `id` (int posicional) y flags opcionales `--title` / `--body`.
- `tests/test_cli.py` — añadidos 5 tests: éxito de cada flag por separado,
  ambos flags juntos, id inexistente y ausencia de flags.
- `feature_list.json` — feature #6 pasada de `in_progress` a `done`.

## Diseño

- **Ausencia de flags:** chequeo temprano `if args.title is None and
  args.body is None: raise NoteError("debes pasar --title y/o --body")`.
  Los argumentos por defecto son `None` (no `""`), porque cadena vacía es un
  valor legítimo para `--body`. `NoteError` lo captura el handler genérico
  ya existente en `main()`, que imprime a stderr y sale con código 1.
- **Id inexistente:** itero `notes` por índice; si no encuentro el `id`,
  lanzo `NoteNotFound` (mismo patrón que `cmd_show` y `cmd_delete`).
- **Inmutabilidad:** la nota se reemplaza construyendo una nueva instancia
  `Note(...)` con `id` y `created_at` preservados y los campos cambiados
  tomados de `args` solo cuando no son `None`. Luego `notes[i] =
  updated.to_dict()` y `storage.save(notes)`. `Note` sigue siendo `frozen`
  porque nunca mutamos la instancia original.
- **Confirmación:** `print(f"editada id={args.id}")` (los tests buscan
  `id=1`, sigue el patrón de `cmd_delete` que imprime `id=...`).
- Sin nuevas dependencias, sin nuevas capas, sin tocar `notes.py` ni
  `storage.py`.

## Output del último `./init.sh`

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

22 tests verdes (17 previos + 5 nuevos para `cli_edit`).

## Estado final en `feature_list.json`

Feature #6 `cli_edit` → `status: "done"`. No quedan features en `in_progress`.
