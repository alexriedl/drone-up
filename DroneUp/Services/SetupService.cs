using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DroneUp.Services
{
		public class SetupService
		{
			private const string DRONES_DIRECTORY = "./drones";

		public int GetMapSeed()
			{
			Random random = new Random();
				return random.Next(1, int.MaxValue);
		}

			public bool UploadDroneScript(string droneScriptName, string droneScriptContent)
			{
				bool successfullyUploadedScript = false;
				string writePath = DRONES_DIRECTORY + "/" + droneScriptName;

				if (!File.Exists(writePath))
				{
				File.WriteAllText(writePath, droneScriptContent);

					successfullyUploadedScript = File.Exists(writePath);
				}

			return successfullyUploadedScript;
			}

			public List<string> GetDroneScriptNames()
			{
				List<string> allDroneScriptNames = new List<string>();
				var files = new DirectoryInfo(DRONES_DIRECTORY).GetFiles();

				foreach (var file in files)
				{
					if (File.Exists(file.FullName))
				{
					allDroneScriptNames.Add(file.Name);
				}
				}
			
			return allDroneScriptNames;
			}

			public Dictionary<string, string> GetDroneScripts(List<string> droneScriptNames)
			{
				Dictionary<string, string> droneScripts = new Dictionary<string, string>();

				foreach (var droneScriptName in droneScriptNames)
				{
				var readPath = DRONES_DIRECTORY + "/" + droneScriptName;
					var droneScriptContent = File.ReadAllText(readPath);

				droneScripts.Add(droneScriptName, droneScriptContent);
				}

				return droneScripts;
			}
		}
}
