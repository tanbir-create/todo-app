
$(function() {{
   
    let createTask = function(){
        let newTaskForm = $('#new-task-form')
         
        newTaskForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/new_todo',
                data: newTaskForm.serialize(),
                
                success: function(data){
                   let newTask = newTaskDOM(data.data.task);
                    $('#task-container>ul').append(newTask);

                    
                    new Noty({
                        theme: 'bootstrap-v4',
                        text: "Task added!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 300
                        
                    }).show();
                  
                  
                    
                },error: function(error){
                    console.log(error.responseText);
                }
            })
             
            $('#new-task-form')[0].reset();
        })       
    }



    let newTaskDOM = function(i){
        console.log('render');
        let date = moment(i.due_date).format('ddd DD MMM YYYY');
        let today = new Date();
        today  = (today-(today%100000))/100000;

        let inputDate  = new Date(i.due_date);
        inputDate = (inputDate-(inputDate%100000))/100000;
        
       
        if((inputDate == today)){
            date = 'Today'
        }
        return $(`<li id="<%=i.category%>" class="All">
 
                    
                    <div class="flex-details"><div class="checkbox-div"><input class = "completed-checkbox" type="checkbox"  data-id=${ i._id } ${ i.isCompleted ? "checked" : ""}></div>

                                    
                    <div class="details <%= i.isCompleted ? 'completedc' : ''%>">
                        <div class="task-text">${i.task }</div>
                        <div class="task-date"><i class="fas fa-calendar-alt"></i> &nbsp${date}</div>
                        <div class="task-category">${ i.category}</div>
                    </div>

                    <div class="delete-container"><div  class="delete-task-button" data-id=${ i._id}><i class="fas fa-trash-alt"></i></div></div></div>
                    <div class="line-between-li"></div>
                </li>
                `)
    }


    createTask();

}
    $("#todo-list").on('click', '.delete-task-button', function(){
        let id = $(this).attr('data-id')
        $.ajax({
            type: 'delete',
    
            url: `/${id}`,
            context: this,

            success: function(){
                // $(`#todo-list #task-${data.data.task_id }`).remove();
               console.log('deleted')
        
                
            },error: function(error){
                console.log(error.responseText);
            }
        })
       let to_delete = $(this).parent().parent().parent();
        to_delete.slideUp('fast', function(){
            to_delete.remove();
        });
        new Noty({
            theme: 'bootstrap-v4',
            text: "Task deleted!",
            type: 'success',
            layout: 'topRight',
            timeout: 300
            
        }).show();
    })




    $("#todo-list").on('click', '.completed-checkbox',function(){
        let id = $(this).attr('data-id')

        $.ajax({
            type: 'put',
            url: `/${id}`,
            context: this,
            success: function(){
              console.log('completed')  
            
        },error: function(error){
            console.log(error.responseText);
        }
        })
        $(this).parent().siblings('.details').toggleClass('completedc');

    })
              
     $('#category-select').on('change', function(){
        
        let category_value = (this).options[this.selectedIndex].value;
        console.log(category_value)
        const todoslist = $("#todo-list"); 
       
        if(category_value === 'All'){
            
            $('[class=All]').show();
        }
        else{
         
                (function(){
                    $('li').filter(function(){
                        
                        return $(this).attr('id')!= category_value;
                    })
                    .hide();
                })();

                $("[id=" + category_value + "]").show();
            
        }

    })
})





