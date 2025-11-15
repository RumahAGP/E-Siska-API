import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import logger from "./utils/logger";
import SiswaRouter from "./routers/siswa.router";
import GuruRouter from "./routers/guru.router";
import TingkatanRouter from "./routers/tingkatan.router";
import KelasRouter from "./routers/kelas.router";
import RuanganRouter from "./routers/ruangan.router";
import MapelRouter from "./routers/mapel.router";
import SkemaRouter from "./routers/skema.router";
import TahunAjaranRouter from "./routers/tahunAjaran.router";
import PenempatanRouter from "./routers/penempatan.router";
import PenugasanRouter from "./routers/penugasan.router";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler(); // Pastikan error handler dipanggil setelah route
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
    // Middleware untuk mencatat setiap request yang masuk
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });

    // Mendaftarkan AuthRouter
    const authRouter: AuthRouter = new AuthRouter();
    this.app.use("/auth", authRouter.getRouter());

    // Mendaftarkan SiswaRouter
    const siswaRouter: SiswaRouter = new SiswaRouter();
    this.app.use("/siswa", siswaRouter.getRouter());

    // 2. Daftarkan GuruRouter
    const guruRouter: GuruRouter = new GuruRouter();
    this.app.use("/guru", guruRouter.getRouter());

    const tingkatanRouter: TingkatanRouter = new TingkatanRouter();
    this.app.use("/tingkatan", tingkatanRouter.getRouter());

    // 4. Daftarkan KelasRouter
    const kelasRouter: KelasRouter = new KelasRouter();
    this.app.use("/kelas", kelasRouter.getRouter());

    // 5. Daftarkan RuanganRouter
    const ruanganRouter: RuanganRouter = new RuanganRouter();
    this.app.use("/ruangan", ruanganRouter.getRouter());

    // 6. Daftarkan MapelRouter
    const mapelRouter: MapelRouter = new MapelRouter();
    this.app.use("/mapel", mapelRouter.getRouter());

    // 7. Daftarkan SkemaRouter
    const skemaRouter: SkemaRouter = new SkemaRouter();
    this.app.use("/skema", skemaRouter.getRouter());

    // 8. Daftarkan TahunAjaranRouter
    const tahunAjaranRouter: TahunAjaranRouter = new TahunAjaranRouter();
    this.app.use("/tahun-ajaran", tahunAjaranRouter.getRouter());

    // 9. Daftarkan PenempatanRouter
    const penempatanRouter: PenempatanRouter = new PenempatanRouter();
    this.app.use("/penempatan", penempatanRouter.getRouter());

    // 10. Daftarkan PenugasanRouter
    const penugasanRouter: PenugasanRouter = new PenugasanRouter();
    this.app.use("/penugasan-guru", penugasanRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        logger.error(
          `${req.method} ${req.path}: ${error.message} ${JSON.stringify(error)}`
        );
        // Menggunakan `error.code` dari AppError untuk status response
        res.status(error.code || 500).send(error);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
    });
  }
}

export default App;