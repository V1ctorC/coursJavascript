
(function(window, $) {

    'use strict';

    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper(this.$wrapper);

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            '.js-new-rep-log-form',
            this.handleNewFormSubmit.bind(this)
        )


    };

    $.extend(window.RepLogApp.prototype, {
        handleRepLogDelete: function (e) {
            e.preventDefault();

            var $link = $(e.currentTarget);

            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin')

            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');
            var self = this;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    $row.fadeOut('normal', function () {
                        //same as $(this).remove();
                        $row.remove();
                        self.updateTotalWeightLifted();
                    });
                }
            })
        },

        handleRowClick: function () {
            console.log('row clicked !');
        },

        updateTotalWeightLifted: function () {

            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();

            var $form = $(e.currentTarget);
            var formData = {};
            $.each($form.serializeArray(), function(key, fieldData) {
                formData[fieldData.name] = fieldData.value;
            });
            $.ajax({
                url: $form.data('url '),
                method: 'post',
                data: JSON.stringify(formData),
                success: function (data) {
                    // todo
                    console.log('Success !');
                },
                error: function (jqXHR) {
                    // todo
                    console.log('Error :(');
                }
            })

        }
    });

    /**
     *  A "private" object
     */
    var Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            var totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight');
            });

            return totalWeight;
        }
    })


})(window, jQuery);