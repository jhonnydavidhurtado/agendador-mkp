import EmptyState from './EmptyState';
import TableActions from './TableActions';

export default function DataTable({
    columns = [],
    data = [],
    actions = null,
    emptyMessage = 'No hay registros disponibles',
}) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">

            <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-gray-200">

                    <thead className="bg-gray-50">
                        <tr>

                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {column.label}
                                </th>
                            ))}

                            {actions && (
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Acciones
                                </th>
                            )}

                        </tr>
                    </thead>


                    <tbody className="divide-y divide-gray-200 bg-white">

                        {data.length > 0 ? (

                            data.map((item, rowIndex) => (

                                <tr key={rowIndex}>

                                    {columns.map((column, columnIndex) => (

                                        <td
                                            key={columnIndex}
                                            className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                                        >

                                            {column.render
                                                ? column.render(item)
                                                : item[column.field]
                                            }

                                        </td>

                                    ))}


                                    {actions && (

                                        <td className="whitespace-nowrap px-6 py-4 text-right">

                                           <TableActions
                                             item={item}
                                                 showHref={
                                                  actions.showHref
                                                  ? actions.showHref(item)
                                                      : null
                                                   }
                                                     editHref={
                                                     actions.editHref
                                                  ? actions.editHref(item)
                                                     : null
                                                    }
                                                   onDelete={actions.onDelete}
                                           />  

                                        </td>

                                    )}

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={
                                        columns.length + (actions ? 1 : 0)
                                    }
                                    className="px-6 py-8"
                                >   
                                
                                    <EmptyState
                                     title={emptyMessage}
                                    />
                                        

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}