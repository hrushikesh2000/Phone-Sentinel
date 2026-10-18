/**
 * Network Latency Diagnostic Utility
 * Performs a lightweight HTTP timing check to evaluate actual network roundtrip latency.
 */

export async function measureNetworkPing() {
  const testEndpoints = [
    'https://1.1.1.1/cdn-cgi/trace',
    'https://www.google.com/generate_204',
  ];

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(testEndpoints[0], {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const latency = Date.now() - startTime;

    let grade = 'Excellent';
    let statusVariant = 'success';
    if (latency < 70) {
      grade = 'Ultra-Fast';
      statusVariant = 'primary';
    } else if (latency < 160) {
      grade = 'Good Response';
      statusVariant = 'success';
    } else if (latency < 320) {
      grade = 'Moderate Lag';
      statusVariant = 'warning';
    } else {
      grade = 'High Latency';
      statusVariant = 'danger';
    }

    return {
      latencyMs: latency,
      grade,
      statusVariant,
      timestamp: Date.now(),
      success: true,
    };
  } catch (err) {
    // Attempt fallback endpoint
    try {
      const fallbackStart = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(testEndpoints[1], {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - fallbackStart;

      return {
        latencyMs: latency,
        grade: latency < 120 ? 'Good Response' : 'Moderate Lag',
        statusVariant: latency < 120 ? 'success' : 'warning',
        timestamp: Date.now(),
        success: true,
      };
    } catch (fallbackErr) {
      return {
        latencyMs: null,
        grade: 'Ping Unreachable',
        statusVariant: 'danger',
        timestamp: Date.now(),
        success: false,
      };
    }
  }
}

