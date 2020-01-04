class RegistrarReciboRequest {
    constructor(Monto, Moneda, Fecha, Comentario, idProvedor) {
        this.Monto = Monto;
        this.Moneda = Moneda;
        this.Fecha = Fecha;
        this.Comentario = Comentario;
        this.idProvedor = idProvedor;
    }
    json() {
        return JSON.stringify({
            Monto: this.Monto,
            Moneda: this.Moneda,
            Fecha: this.Fecha,
            Comentario: this.Comentario,
            idProvedor: this.idProvedor
        });
    }
    enviarPeticion() {
        if (!DevExpress.validationEngine.validateGroup('validarRecibo').isValid)
            return;
        var data = this.json();
        $.ajax({
            url: AxosApiClient.UrlApi() + 'api/Recibo/RegistrarRecibo',
            data: data,
            type: 'post',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            complete: function (jqXHR, textStatus) {
                if (textStatus === 'success' && jqXHR.responseJSON) {
                    toastr.success(jqXHR.responseJSON.Mensaje, 'Bienvenido');
                    setTimeout(function () {
                        window.location = '/Recibo';
                    }, 1000);
                }
            }
        });
    }
}

$(document).ready(function (e) {
    $('#txtMonto').dxNumberBox({
        placeholder: 'Monto',
        min: 1
    }).dxValidator({
        validationRules: [
            {
                type: "required",
                message: "El monto es requerido para registrar un monto"
            },
            {
                type: 'custom',
                validationCallback: function (e) {
                    return e.value > 0;
                },
                message: 'El valor debe ser mayor a 0'
            }

        ],
        validationGroup: 'validarRecibo'
    });
    $('#comboMoneda').dxSelectBox({
        placeholder: 'Moneda',
        dataSource: [
            {
                "Moneda": "MXN"

            },
            {
                "Moneda": "USD"
            }
        ],
        displayExpr: "Moneda",
        valueExpr: "Moneda"
    }).dxValidator({
        validationRules: [{
            type: "required",
            message: "La moneda es requerida"
        }],
        validationGroup: 'validarRecibo'
    });
    $('#dateFecha').dxDateBox({
        placeholder: 'Fecha',
        value: moment().format(),
        displayFormat: 'dd/MM/yyyy',
        max: moment().format(),
        min: moment().add(-2, 'y').toDate()
    }).dxValidator({
        validationRules: [{
            type: "required",
            message: "Se requiere una fecha para registrar un recibo"
        }],
        validationGroup: 'validarRecibo'
    });
    $('#comboProvedores').dxSelectBox({
        placeholder: 'Provedor',
        dataSource: AxosApiClient.UrlApi() + 'api/Provedor/GetProvedores',
        displayExpr: 'name',
        valueExpr: 'value',
        searchEnabled: true,
        acceptCustomValue: true,
        onCustomItemCreating: function (e) {
            $.post(AxosApiClient.UrlApi() + '/api/Provedor/RegistrarProvedor?nombre=' + e.text, function (response) {
                var dataSource = $('#comboProvedores').dxSelectBox('getDataSource');
                dataSource.reload();
                $('#comboProvedores').dxSelectBox('instance').option('value', response.ObjectResponse);
            });
            var newItem = e.text;
            e.customItem= newItem;
        }
    }).dxValidator({
        validationRules: [{
            type: "required",
            message: "Se requiere de un provedor"
        }],
        validationGroup: 'validarRecibo'
    });
    $('#txtComentario').dxTextArea({
        hint: "Escriba un comentario"
    });
    $('#btnRegistrar').dxButton({
        text: 'Registrar Recibo',
        icon: 'fas fa-check',
        type: 'success',
        onClick: function (e) {
            let request = new RegistrarReciboRequest(
                $('#txtMonto').dxNumberBox('instance').option('value'),
                $('#comboMoneda').dxSelectBox('instance').option('value'),
                $('#dateFecha').dxDateBox('instance').option('value'),
                $('#txtComentario').dxTextArea('instance').option('value'),
                $('#comboProvedores').dxSelectBox('instance').option('value'));
            request.enviarPeticion();
        }
    });
    $('#btnCancelar').dxButton({
        text: 'Cancelar',
        icon: 'fas fa-ban',
        type: 'danger',
        onClick: function (e) {
            window.location = '/Recibo';
        }
    });
});