using System;
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
  }
}
