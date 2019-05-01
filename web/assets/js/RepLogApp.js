
(function(window, $) {

    'use strict';

    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper(this.$wrapper);

        this.$wrapper.find('.js-delete-rep-log').on(
            'click',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.find('tbody tr').on(
            'click',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.find('.js-new-rep-log-form').on(
            'submit',
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
            var $tbody = this.$wrapper.find('tbody');
            var self = this;
            $.ajax({
                url: $form.attr('action'),
                method: 'post',
                data: $form.serialize(),
                success: function (data) {
                    $tbody.append(data);
                    self.updateTotalWeightLifted();
                },
                error: function (jqXHR) {
                    $form.closest('.js-new-rep-log-form-wrapper')
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