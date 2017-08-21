﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DroneUp.Services;
using Microsoft.AspNetCore.Mvc;

namespace DroneUp.Controllers
{
    public class HomeController : Controller
    {
	    private readonly SetupService setupService;

	    public HomeController()
	    {
		    setupService = new SetupService();
	    }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }


	    [HttpPost("/api/upload")]
	    public IActionResult UploadDroneScript(string droneName, string droneScriptContent)
	    {
		    if (setupService.UploadDroneScript(droneName, droneScriptContent))
		    {
			    return Ok();
		    }
		    return Error();
		}

	    [HttpGet("/api/mapseed")]
	    public IActionResult GetMapSeed()
	    {
		    return Ok(setupService.GetMapSeed());
		}

	    [HttpGet("/api/dronenames")]
	    public IActionResult GetDroneScriptNames()
	    {
		    return Ok(setupService.GetDroneScriptNames());
		}

	    [HttpGet("/api/dronescripts")]
	    public IActionResult GetDroneScripts(List<string> droneScriptNames)
	    {
		    return Ok(setupService.GetDroneScripts(droneScriptNames));

	    }
	}
}
