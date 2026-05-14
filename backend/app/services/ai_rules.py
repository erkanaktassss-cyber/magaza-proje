def generate_recommendations(downtime_counts: dict[str, int], scrap_ratio: float) -> list[str]:
    out = []
    for reason, count in downtime_counts.items():
        if count >= 3:
            out.append(f"'{reason}' duruşu {count} kez tekrarlandı: kök neden analizi yapılmalı.")
    if scrap_ratio > 0.03:
        out.append("Fire oranı %3 üzerinde: kalite aksiyon planı başlatılmalı.")
    if not out:
        out.append("Sistem stabil görünüyor, mevcut standart çalışmayı sürdürün.")
    return out
