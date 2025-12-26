use chrono::{DateTime, Local, TimeZone};

/// Format a Unix timestamp (milliseconds) to a human-readable string.
pub fn format_timestamp(ts: i64) -> String {
    Local
        .timestamp_millis_opt(ts)
        .single()
        .map(|dt: DateTime<Local>| dt.format("%Y-%m-%d %H:%M").to_string())
        .unwrap_or_else(|| "Unknown".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_timestamp() {
        let ts = 1703548800000; // 2023-12-26 00:00:00 UTC
        let result = format_timestamp(ts);
        assert!(result.contains("2023-12-2"));
    }

    #[test]
    fn test_format_invalid_timestamp() {
        let result = format_timestamp(i64::MIN);
        assert_eq!(result, "Unknown");
    }
}
