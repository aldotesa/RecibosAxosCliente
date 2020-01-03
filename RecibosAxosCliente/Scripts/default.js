﻿AxosApiClient = {
    Token: function () { return `Bearer ${localStorage.Token}`; },
    UrlApi: function () { return $('#hfUrlApi').val(); },
    LoadPanel: function (titulo) {
        if (!titulo || titulo.trim() === '')
            titulo = 'Cargando ...';
        return $('#loadPanelGeneral').dxLoadPanel({
            shadingColor: "rgba(0,0,0,0.4)",
            position: { of: "#body" },
            visible: false,
            showIndicator: true,
            showPane: true,
            shading: true,
            message: titulo,
            closeOnOutsideClick: false
        }).dxLoadPanel('instance');
    }
};
$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
    console.log(jqXHR);
    if (jqXHR.status === 401) {
        cerrarSesion();
        return;
    }
    console.log("Control errores default.js:", jqXHR);

    toastr.warning(!jqXHR.responseJSON || jqXHR.responseJSON === '' || jqXHR.responseJSON === undefined ? 'Error no especificado, vea la consola de errores.' : jqXHR.responseJSON.ExceptionMessage, "Aviso", { timeOut: 5000 });
});


$('#btnCerrarSesion').click(function (e) {
    e.preventDefault();
    cerrarSesion();
});

function cerrarSesion() {
    $.post("/Account/LogOffAjax", (request) => {
        localStorage.clear();
        window.location = request;
    });
}

function configuracionToastr() {
    toastr.options.preventDuplicates = true;
    toastr.options.maxOpened = 0;
    toastr.options.preventOpenDuplicates = true;
    toastr.options.progressBar = true;
    toastr.options.closeButton = true;
    toastr.options.escapeHtml = true;
    toastr.options.updateTimerOnDuplicates = true;
    toastr.options.positionClass = 'toast-top-full-width';
    toastr.options.closeDuration = 300;
    toastr.options.timeOut = 1500;

}
