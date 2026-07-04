<?php

namespace App\Actions\Exports;

use League\Csv\Writer;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Streams a tabular dataset to the browser as a CSV download.
 *
 * The action is deliberately domain-agnostic: give it column headings and rows
 * of scalar values and it will produce a download for any dataset (ledger,
 * audit log, reconciliation report, etc.).
 */
final class ExportRowsToCsv
{
    /**
     * @param  list<string>  $headings
     * @param  iterable<array<int|string, scalar|null>>  $rows
     */
    public function __invoke(string $filename, array $headings, iterable $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headings, $rows): void {
            $csv = Writer::createFromStream(fopen('php://output', 'wb'));
            $csv->insertOne($headings);

            foreach ($rows as $row) {
                $csv->insertOne(array_values($row));
            }
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
