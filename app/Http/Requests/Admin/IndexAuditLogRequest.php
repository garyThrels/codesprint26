<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates and normalises the filter, sort and pagination parameters used by
 * the audit log listing and its exports.
 */
final class IndexAuditLogRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', Rule::in(['logged_at', 'description', 'log_name', 'causer'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', Rule::in([10, 25, 50, 100])],
        ];
    }

    public function search(): ?string
    {
        return $this->string('search')->trim()->value() ?: null;
    }

    public function sortColumn(): string
    {
        return match ($this->input('sort')) {
            'description' => 'description',
            'log_name' => 'log_name',
            default => 'created_at',
        };
    }

    public function sortDirection(): string
    {
        return $this->input('direction') === 'asc' ? 'asc' : 'desc';
    }

    public function perPage(): int
    {
        return (int) ($this->input('per_page') ?? 25);
    }
}
