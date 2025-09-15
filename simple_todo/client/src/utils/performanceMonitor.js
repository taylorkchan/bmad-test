// Performance monitoring utilities for OCR operations
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.sessionMetrics = [];
  }

  // Start timing an operation
  startTiming(operationId, metadata = {}) {
    this.metrics.set(operationId, {
      startTime: performance.now(),
      startMemory: this._getMemoryUsage(),
      metadata
    });
  }

  // End timing and record metrics
  endTiming(operationId, additionalData = {}) {
    const metric = this.metrics.get(operationId);
    if (!metric) {
      console.warn(`No timing started for operation: ${operationId}`);
      return null;
    }

    const endTime = performance.now();
    const endMemory = this._getMemoryUsage();
    
    const result = {
      operationId,
      duration: Math.round(endTime - metric.startTime),
      memoryDelta: endMemory - metric.startMemory,
      timestamp: new Date().toISOString(),
      ...metric.metadata,
      ...additionalData
    };

    // Store in session metrics
    this.sessionMetrics.push(result);
    
    // Clean up
    this.metrics.delete(operationId);
    
    console.log(`Performance [${operationId}]:`, {
      duration: `${result.duration}ms`,
      memory: `${result.memoryDelta > 0 ? '+' : ''}${(result.memoryDelta / 1024 / 1024).toFixed(2)}MB`,
      ...additionalData
    });

    return result;
  }

  // Get current memory usage (if available)
  _getMemoryUsage() {
    try {
      if (performance && performance.memory && performance.memory.usedJSHeapSize) {
        return performance.memory.usedJSHeapSize;
      }
    } catch (error) {
      // Memory API not available or restricted
      console.debug('Memory usage tracking not available:', error.message);
    }
    return 0;
  }

  // Get performance summary
  getPerformanceSummary() {
    if (this.sessionMetrics.length === 0) {
      return null;
    }

    const ocrMetrics = this.sessionMetrics.filter(m => 
      m.operationId.includes('ocr') || m.operationId.includes('image')
    );

    if (ocrMetrics.length === 0) {
      return null;
    }

    const durations = ocrMetrics.map(m => m.duration);
    
    return {
      totalOperations: ocrMetrics.length,
      averageDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalTime: durations.reduce((a, b) => a + b, 0),
      lastUpdated: new Date().toISOString()
    };
  }

  // Clear metrics history
  clearMetrics() {
    this.metrics.clear();
    this.sessionMetrics = [];
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      sessionMetrics: [...this.sessionMetrics],
      summary: this.getPerformanceSummary(),
      exportedAt: new Date().toISOString()
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for common measurements
export const measureOCRPerformance = {
  startImageProcessing: (imageFile) => {
    performanceMonitor.startTiming('image_processing', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });
  },

  endImageProcessing: (result) => {
    return performanceMonitor.endTiming('image_processing', {
      success: result.success,
      confidence: result.confidence,
      textLength: result.rawText ? result.rawText.length : 0
    });
  },

  startOCROperation: (operationType, metadata = {}) => {
    performanceMonitor.startTiming(`ocr_${operationType}`, metadata);
  },

  endOCROperation: (operationType, result = {}) => {
    return performanceMonitor.endTiming(`ocr_${operationType}`, result);
  }
};