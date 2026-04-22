export class IntegrationService {
  constructor(getState) {
    this.getState = getState;
  }

  async testConnection() {
    const { settings } = this.getState();
    if (settings.dataSource !== 'delta') {
      return { ok: true, message: 'Manuel/Barkod modunda test bağlantısı gerekmiyor.' };
    }

    await new Promise((resolve) => setTimeout(resolve, 850));

    if (!settings.delta.ip || !settings.delta.port) {
      return { ok: false, message: 'Delta bağlantısı için IP/Port eksik.' };
    }

    return {
      ok: true,
      message: `Mock bağlantı başarılı (${settings.delta.protocol} - ${settings.delta.ip}:${settings.delta.port}).`
    };
  }

  async pullLineSnapshot() {
    const { settings } = this.getState();
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      source: settings.dataSource,
      receivedAt: new Date().toISOString(),
      note: 'Entegrasyon katmanı hazır. Gerçek PLC driver modülü bu noktaya bağlanacak.'
    };
  }
}
