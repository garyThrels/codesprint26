<?php

namespace App\Actions\Exports;

use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\Response;

/**
 * Renders a tabular dataset to a downloadable PDF using the shared
 * `exports.table` template. Domain-agnostic: works for any dataset that can be
 * expressed as headings plus rows of scalar values.
 */
final class ExportRowsToPdf
{
    /**
     * @param  list<string>  $headings
     * @param  iterable<array<int|string, scalar|null>>  $rows
     */
    public function __invoke(string $filename, string $title, array $headings, iterable $rows): Response
    {
        $pdf = Pdf::loadView('exports.table', [
            'title' => $title,
            'headings' => $headings,
            'rows' => $rows,
            'generatedAt' => now(),
        ]);

        return $pdf->download($filename);
    }
}
