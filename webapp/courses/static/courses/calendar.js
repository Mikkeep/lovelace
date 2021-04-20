function reserve_slot(e, elem) {
    e.preventDefault();

    let form = $(elem).closest('form');
    let reservation_field = form.children('input[name="reserve"]');
    let submit_button = $(elem);
    let reservation_result = $(elem).parent().siblings('.reservation-result');
    let calendar = form.parent();

    if (reservation_field.val() == "1") {
        reservation_result.html("Reservation sent, awaiting for confirmation.");
    } else {
        reservation_result.html("Cancellation sent, awaiting for confirmation.");
    }

    submit_button.attr("disabled", true);

    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function(data, text_status, jqxhr_obj) {
            reservation_result.html(data.msg);
            reservation_result.removeClass("collapsed");
            calendar.children("form").each(function () {
                if (data.can_reserve) {
                    $(this).find("input[type='submit']").attr("disabled", false)
                }
                else {
                    $(this).find("input[type='submit']").attr("disabled", true)
                }
            });
            let slot_span = form.find("span.right-float");
            slot_span.html(data.slots);
            if (reservation_field.val() == "1") {
                submit_button.val(submit_button.attr("data-cancel-text"));
                reservation_field.val("0");
                if (data.full) {
                    form.find("div.datetime").addClass("event-full");
                }
            } else {
                submit_button.val(submit_button.attr("data-reserve-text"));
                reservation_field.val("1");
                if (!data.full) {
                    form.find("div.datetime").removeClass("event-full");
                }
            }
            
            submit_button.attr("disabled", false);
        },
        error: function(xhr, status, type) {
            reservation_result.html(JSON.parse(xhr.responseTextt).msg);
        }
    });
}
