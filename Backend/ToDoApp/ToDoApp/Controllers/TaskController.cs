using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ToDoApp.Models;

namespace ToDoApp.Controllers
{
    [RoutePrefix("Api/Tasks")]
    public class TaskController : ApiController
    {
        [Route("AllTasks")]
        [HttpGet]
        public HttpResponseMessage GetAllTasks()       
        {
            List<Task> taskList = new List<Task>();
            try
            {
                using (DBEntities db = new DBEntities())
                {
                    taskList = db.Tasks.ToList<Task>();
                }
                return Request.CreateResponse(HttpStatusCode.OK, taskList);
            }
            catch(Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, taskList);
            }
        }

        [Route("AddTask")]
        [HttpPost]
        public HttpResponseMessage AddTask([FromBody]Task taskValue)
        {
            try
            {
                Models.Task objTask = new Task();
                objTask.Title = taskValue.Title;
                objTask.IsCompleted = false;
                objTask.Modified = DateTime.Now;
                objTask.Created =  DateTime.Now;

                using (DBEntities db = new DBEntities())
                {
                    db.Tasks.Add(objTask);
                    db.SaveChanges();
                }
                return Request.CreateResponse(HttpStatusCode.OK, objTask.TaskID);
            }
            catch(Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }

        [Route("UpdateTask")]
        [HttpPost]
        public HttpResponseMessage UpdateCompleteTask([FromBody]Task taskValue)
        {
            try
            {
                var objUpdateTask = new Task();
                using (DBEntities db = new DBEntities())
                {
                    objUpdateTask = db.Tasks.Where(x => x.TaskID == taskValue.TaskID).ToList().FirstOrDefault();
                    if (objUpdateTask.TaskID > 0)
                    {
                        objUpdateTask.Title = taskValue.Title;
                        objUpdateTask.IsCompleted = Convert.ToBoolean(taskValue.IsCompleted) ? true : false;
                        objUpdateTask.Modified = DateTime.Now;
                    }
                    db.SaveChanges();
                }
                return Request.CreateResponse(HttpStatusCode.OK, objUpdateTask.TaskID);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }

        [Route("DeleteTask")]
        [HttpDelete]
        public HttpResponseMessage Delete(int taskID)
        {
            try
            {
                using (DBEntities db = new DBEntities())
                {
                    var objDeleteTask = db.Tasks.Where(x => x.TaskID == taskID).ToList().FirstOrDefault();
                    db.Tasks.Remove(objDeleteTask);
                    db.SaveChanges();
                }
                return Request.CreateResponse(HttpStatusCode.OK, taskID);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, taskID);
            }
        }
    }
}
