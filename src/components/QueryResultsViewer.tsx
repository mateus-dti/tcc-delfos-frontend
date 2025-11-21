import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface QueryResultsViewerProps {
    results: any[];
}

export function QueryResultsViewer({ results }: QueryResultsViewerProps) {
    if (!results || results.length === 0) {
        return (
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618] min-h-[200px] flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">
                    No results found.
                </p>
            </Card>
        );
    }

    // Extract headers from the first row keys
    const headers = Object.keys(results[0]);

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618]">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
                            {headers.map((header) => (
                                <TableHead key={header} className="text-slate-900 dark:text-white font-semibold whitespace-nowrap">
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((row, rowIndex) => (
                            <TableRow key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-200 dark:border-slate-800 last:border-0">
                                {headers.map((header) => (
                                    <TableCell key={`${rowIndex}-${header}`} className="text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                        {String(row[header])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1c2327]">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {results.length} rows
                </p>
            </div>
        </Card>
    );
}
