
(function(){

    let current_question_id = 0;
    let question_cache = {};

    $(document).ready(function(){

        // Add a helper method to the handlebard templating engine
        Handlebars.registerHelper('safeVal', function (a, b) {return a ? a : b;});
        Handlebars.registerHelper('ternary', function(cond, v1, v2) {
            return cond ? v1 : v2;
         });
        refresh_questions();

        $('#new_question_form').submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                type: 'POST',
                success: function(data) {
                    refresh_questions();
                }
            });
            return false;
        });


        $('#questions_list').on('click', 'li', function(e){
            let question_id = $(this).data('question-id');
            refresh_question(question_id);
        });

        // Handle the Click event for the "Delete" button per response on a question
        $('#questions_info').on('click', '.btn-delete-question-response', function(e){


            let hiddenActionInput = $(this).parent().parent().find('.response-delete-form-input');
            let response_index = hiddenActionInput.data('response-index');

            let responses =  question_cache[current_question_id].question_responses;

            if(responses[response_index].should_delete) responses[response_index].should_delete = false;
            else responses[response_index].should_delete = true;
            
            hiddenActionInput.val(responses[response_index].should_delete);
            
            if(responses[response_index].should_delete === true)
            {
                $(this).parent().parent().fadeTo('fast', 0.25);
                $(this).text("undo-delete");
            }
            else
            {
                $(this).parent().parent().fadeTo('fast', 1.0);
                $(this).text("delete");
            }
        })


        // Listen for changes to a response textbox
        // and update the question data in our question_cache to match.
        $('#questions_info').on('input', '.question-response-item', function(e) {
            question_cache[current_question_id].question_responses[$(this).data('response-index')].description = $(this).val();
        })

        // Listen for click event on the 'Add Response' Button
        // this method will add data to the questions_cache and re-render via handlebars.
        $('#questions_info').on('click', '.btn-add-question-response', function(e){

            let text = $(this).parent().parent().find('.question-response-item-add').val();

            question_cache[current_question_id].question_responses.push({
                description: text,
                should_delete: false,
                id: ''
            });

            refresh_question(current_question_id);
        });

    })

    function update_page_part(target_id, template_id, data)
    {
        let source   = document.getElementById(template_id).innerHTML;
        let template = Handlebars.compile(source);
        let html    = template(data);
        document.getElementById(target_id).innerHTML = html;
    }

    function load_questions_list() {
        return fetch('/rooms/' + ROOM_NAME + '/questions')
            .then(response => response.json())
    }

    function load_question(question_id) {

        if(question_cache[question_id])
            return Promise.resolve(question_cache[question_id])
        
        return fetch('/rooms/' + ROOM_NAME + '/questions/' + question_id)
            .then(response => response.json())
            .then(data => {
                question_cache[data.id] = data;
                return data;
            });
    }

    function refresh_questions() {
        load_questions_list().then(data => {
            update_page_part("questions_list", "question-list-template", {questions: data})
        });
    }

    function refresh_question(question_id) {
        current_question_id = question_id;
        load_question(question_id).then(data => {
            update_page_part("questions_info", "question-info-template", {question: data} )
            
            quill = new Quill('#question-editor', {
                theme: 'snow'
            });

            quill.on('text-change', function(delta, oldDelta, source) {
                question_cache[current_question_id].description = quill.getText();
            });

            $('#update_question_form').submit(function(e){
                e.preventDefault();

                let questionDescription = question_cache[current_question_id].description
                $('#question_description_input').val( questionDescription )
                
                $.ajax({
                    url: $(this).data('url'),
                    data: $(this).serialize(),
                    type: 'PATCH',
                    success: function(data) {

                        // delete the old question so that we fetch a new one.
                        question_cache[question_id] = data;

                        // relod the question
                        refresh_question(question_id);
                    }
                });

                return false;
            });

        });
    }

})();