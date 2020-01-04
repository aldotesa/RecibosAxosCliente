$(document).ready(function (e) {
    $("#gridMisRecibos").dxDataGrid({
        remoteOperations: true,
        dataSource: DevExpress.data.AspNet.createStore({
            loadUrl: AxosApiClient.UrlApi() + "/api/Recibo/GetRecibosByUserGrid"
        }),
        searchPanel: {
            visible: true,
            width: 250
        },
        filterRow: {
            visible: false,
            applyFilter: "auto"
        },
        sorting: {
            mode: 'multiple'
        },
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 50, 100],
            showInfo: true
        },
        allowColumnResizing: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        onToolbarPreparing: function (e) {
            var toolbar = e.toolbarOptions.items;
            var dataGrid = e.component;

            toolbar.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        .addClass("informer")
                        .append(
                            $("<h2 class='text-center'/>")
                                .addClass("count")
                                .text(dataGrid.totalCount()),
                            $("<span />")
                                .addClass("name")
                                .text("Recibo(s)")
                        );
                }
            },
                {
                    widget: "dxButton",
                    showText: 'inMenu',
                    options: {
                        hint: 'Agregar',
                        text: 'Agregar',
                        type: 'normal',
                        icon: "fas fa-plus",
                        onClick: function () {
                            window.location = '../Recibo/Register';
                        }
                    },
                    location: "after"
                });
        },
        columns: [


            {
                dataField: 'IdRecibo',
                caption: 'Id',
                visible: true,
                alignment: 'center',
                dataType: 'decimal',
                hidingPriority: 6
            },
            {
                dataField: 'Moneda',
                caption: 'Moneda',
                dataType: 'string',
                alignment: 'center',
                hidingPriority: 7
            },
            {
                dataField: 'Monto',
                alignment: 'center',
                dataType: 'number',
                format: {
                    type: 'currency',
                    precision: 2,
                    currency: 'MXN',
                    formatter: function (object) {
                        return '$' + object.toFixed(2);
                    }
                },
                hidingPriority: 3
            },
            {
                dataField: 'Fecha',
                caption: 'Fecha',
                dataType: 'date',
                format: 'dd/MM/yyyy HH:mm:ss',
                alignment: 'center',
                hidingPriority: 4
            },
            {
                dataField: 'Nombre',
                caption: 'Provedor',
                dataType: 'string',
                alignment: 'center',
                hidingPriority: 5
            },
            {
                dataField: 'Comentario',
                caption: 'Comentario',
                dataType: 'string',
                alignment: 'center',
                hidingPriority: 1
            },
            {
                dataField: 'UserName',
                caption: 'Nombre de Usuario',
                dataType: 'string',
                alignment: 'center',
                hidingPriority: 0
            },
            {
                dataField: 'Opciones',
                caption: 'Opciones',
                allowFiltering: false,
                allowSorting: false,
                hidingPriority: 8,
                alignment: 'center',
                cellTemplate: function (cellElement, cellInfo) {
                    MenuGrid(cellElement, cellInfo); 
                }
            }
        ],

        onContentReady: function (event) {
            $(".informer .count").text(event.component.totalCount());
        }
    }).dxDataGrid("instance");
});

function MenuGrid(cellElement, cellInfo) {
    var dataSourceMenuGrid = [
        { command: 'editar', icon: 'fas fa-edit', text: 'Editar', data: cellInfo.data },
        { command: 'eliminar', icon: 'fa fa-trash', text: 'Eliminar', data: cellInfo.data }
    ];
    var menuGrid = $("<div/>", { 'id': 'contextMenu-opciones-gridRecibos-' + cellInfo.data.IdRecibo })
        .dxActionSheet({
            dataSource: dataSourceMenuGrid,
            title: "Opciones",
            target: '#opc-gridRecibo-' + cellInfo.data.IdRecibo,
            usePopover: true,
            width: "250",
            onItemClick: function (value) {
                var reciboRow = value.itemData.data;
                if (!reciboRow) {
                    toastr.warning('El nodo de datos[value.itemData.data] esta vacio', 'Error');
                    //DevExpress.ui.notify('El nodo de datos[value.itemData.data] esta vacio', 'warning');
                    return;
                }
                switch (value.itemData.command) {
                    case 'editar':
                        window.open('/Recibo/Editar' +
                            '?idRecibo=' +
                            value.itemData.data.IdRecibo);
                        break;
                    case 'eliminar':
                        eliminarRecibo(value.itemData.data.IdRecibo);
                        break;
                    default:
                        toastr.warning('Opción[' + event.command + '] no disponible.', 'Error');
                        //DevExpress.ui.notify('Opción[' + event.command + '] no disponible.', 'warning');
                        break;
                }
            }
        }).appendTo(cellElement);
    $("<a/>",
        {
            'id': 'opc-gridRecibo-' + cellInfo.data.IdRecibo,
            'class': 'btn ',
            'title': 'OPCIONES',
            'data-toggle': 'tooltip'
        })
        .append($('<i/>', { 'class': 'fa fa-fw fa-bars' }))
        .click(function (event) {
            event.preventDefault();
            menuGrid.dxActionSheet("instance").option('visible', true);
        })
        .appendTo(cellElement);
    $('[data-toggle="tooltip"]').tooltip();
}

function eliminarRecibo(id) {

    $.ajax({
        url: AxosApiClient.UrlApi() +'api/Recibo/EliminarRecibo?idRecibo='+id,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        complete: function (jqXHR, textStatus) {
            if (jqXHR.status === 204) {
                $('#gridMisRecibos').dxDataGrid('instance').refresh();
                toastr.success('Eliminado Correctamente', 'Éxito', {
                    "closeButton": true
                });
            }
            else
                toastr.error('Error al eliminar', 'Error', {
                    "closeButton": true
                });
        },
    });
}