
# BatchProcessing ライブラリ

このライブラリは、大量のデータを効率的に非同期で処理するためのツールを提供します。

## モジュール

### 1. ChunkedProcessing

#### 使用例: 大量のデータをチャンクに分割したい場合

```typescript
import { splitIntoChunks } from './BatchProcessing/ChunkedProcessing';

const data = Array.from({ length: 103 }, (_, i) => i);
const chunkSize = 20;
const chunks = splitIntoChunks(data, chunkSize);
```

#### 使用例: `processInChunks`を使用してデータを非同期で処理する場合

```typescript
import { processInChunks } from './BatchProcessing/ChunkedProcessing';

const data = Array.from({ length: 103 }, (_, i) => i);
const chunkSize = 20;

const asyncProcessor = async (chunk: number[]) => {
  // ここで非同期処理を行う
  return chunk.map(item => item * 2);
};

const results = await processInChunks(data, asyncProcessor, chunkSize);
```

#### 使用例: `createChunkedPromises`を使用して非同期処理の制御を呼び出し側で行う場合

```typescript
import { createChunkedPromises } from './BatchProcessing/ChunkedProcessing';

const data = Array.from({ length: 103 }, (_, i) => i);
const chunkSize = 20;

const asyncProcessor = async (chunk: number[]) => {
  // ここで非同期処理を行う
  return chunk.map(item => item * 2);
};

const chunkPromises = createChunkedPromises(data, asyncProcessor, chunkSize);
// ここで非同期処理の制御を行う
```

### 2. ConcurrencyLimiting

#### 使用例: 大量のデータをチャンクに分割しつつ、同時実行数を制限したい場合

```typescript
import { limitedAsyncProcessor } from './BatchProcessing/ConcurrencyLimiting';

const data = Array.from({ length: 103 }, (_, i) => i);
const chunkSize = 20;

const asyncProcessor = async (chunk: number[]) => {
  // ここで非同期処理を行う
  return chunk.map(item => item * 2);
};

const results = await limitedAsyncProcessor(data, asyncProcessor, chunkSize);
```
