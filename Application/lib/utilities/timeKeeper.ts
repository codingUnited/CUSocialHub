export function fromNow({
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0
}: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}) {
    const now = Date.now();

    const totalMs =
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000;

    return new Date(now + totalMs);
}


export function atDateTime({
    year,
    month,
    day,
    hour,
    minute = 0,
    second = 0,
    period = "AM"
}: {
    year: number;
    month: number; // 1–12
    day: number;
    hour: number;  // 1–12
    minute?: number;
    second?: number;
    period?: "AM" | "PM";
}) {
    // Convert to 24-hour time
    let h = hour % 12; // 12 AM → 0, 12 PM → 12
    if (period === "PM") h += 12;

    return new Date(Date.UTC(year, month - 1, day, h, minute, second));
}

