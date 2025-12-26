//! Table display utilities.

use prettytable::{Cell, Row, Table, format};

use common::format_timestamp;
use db::Note;

/// Display notes in a formatted table.
pub fn display_notes(notes: &[Note]) {
    let mut table = Table::new();
    table.set_format(*format::consts::FORMAT_BOX_CHARS);

    table.add_row(Row::new(vec![
        Cell::new("ID").style_spec("bFc"),
        Cell::new("Title").style_spec("bFy"),
        Cell::new("Content").style_spec("bFw"),
        Cell::new("Created").style_spec("bFm"),
    ]));

    for note in notes {
        table.add_row(Row::new(vec![
            Cell::new(note.short_id()).style_spec("Fc"),
            Cell::new(&note.title).style_spec("Fy"),
            Cell::new(&note.content_preview()),
            Cell::new(&format_timestamp(note.created_at)).style_spec("Fm"),
        ]));
    }

    table.printstd();
}
