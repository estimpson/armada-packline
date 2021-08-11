using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using PInvoke;

public class PrinterInfo
{
    public string PrinterName { get; set; }
    public string PrinterDriver { get; set; }
    public string ServerName { get; set; }
    public string ShareName { get; set; }
    public string PortName { get; set; }
    public string Comment { get; set; }
    public string Location { get; set; }
    public string SepFile { get; set; }
    public string PrintProcessor { get; set; }
    public string DataType { get; set; }
    public string Parameters { get; set; }
    public uint Attributes { get; set; }
    public uint Priority { get; set; }
    public uint DefaultPriority { get; set; }
    public uint StartTime { get; set; }
    public uint UntilTime { get; set; }
    public uint Status { get; set; }
    public uint cJobs { get; set; }
    public uint AveragePPM { get; set; }
}

[ApiController]
public class PrinterController : ControllerBase
{
    [HttpGet("api/printerlist")]
    public ActionResult<IEnumerable<PrinterInfo>> GetAll()
    {
        return Winspool.EnumPrinters(PrinterEnumFlags.PRINTER_ENUM_LOCAL)
            .Select(p => new PrinterInfo
            {
                PrinterName = p.pPrinterName?.Trim(),
                PrinterDriver = p.pDriverName?.Trim(),
                ServerName = p.pServerName?.Trim(),
                ShareName = p.pShareName?.Trim(),
                PortName = p.pPortName?.Trim(),
                Comment = p.pComment?.Trim(),
                Location = p.pLocation?.Trim(),
                SepFile = p.pSepFile?.Trim(),
                PrintProcessor = p.pPrintProcessor?.Trim(),
                DataType = p.pDatatype?.Trim(),
                Parameters = p.pParameters?.Trim(),
                Attributes = p.Attributes,
                Priority = p.Priority,
                DefaultPriority = p.DefaultPriority,
                StartTime = p.StartTime,
                UntilTime = p.UntilTime,
                Status = p.Status,
                cJobs = p.cJobs,
                AveragePPM = p.AveragePPM
            })
            .ToList();
    }
}