import type { CompanyPage } from '../content'

export const zhongfeiRefactor: CompanyPage & { slug: string } = {
  slug: 'app-refactor',
  title: 'App 重构',
  summary: 'Java / Kotlin 混编、DJI SDK 能力复用与 MVVM 改造',
  intro: '我负责中飞赛维无人机飞巡 App 的 Android 重构，主要工作包括引入 Kotlin、统一机巢端与飞巡 App 的 SDK 工具类，以及逐步将 MVC、MVP 页面改为 MVVM。',
  sections: [
    {
      title: 'Java 与 Kotlin 的渐进迁移',
      text: '我先约定混编规范：既有 Java 代码继续用 Java 维护，新增代码统一用 Kotlin。按新增功能逐步引入 Kotlin，可以把每次改动控制在较小范围，也更容易定位回归问题。',
      points: [
        {
          title: '先把 Java 接口的空值约定说清楚',
          text: 'Java 引用类型缺少空值注解时，Kotlin 会将它视为平台类型，编译通过也可能在运行时遇到空值。与旧模块或 SDK 交界时，应在入口把返回值明确成可空或非空，再分别处理缺失数据和正常值。',
        },
        {
          title: '保留 Java 调用方的使用方式',
          text: 'Kotlin 的默认参数不会自动生成 Java 可调用的重载，object 或 companion object 中的函数也不一定能按静态方法调用。需要兼容旧调用点时，可以保留 Java 接口，或按需使用 @JvmOverloads、@JvmStatic。',
        },
        {
          title: '核对 SDK 回调的线程和生命周期',
          text: '把回调接入协程时，先确认回调在哪个线程触发、注册后如何解除监听，以及取消协程后回调是否仍会到达。否则页面关闭后仍可能收到回调，或从后台线程更新界面。',
        },
      ],
    },
    {
      title: '统一机巢端和飞巡 App 的 DJI SDK 工具类',
      text: '机巢端和飞巡 App 都依赖大疆的飞行能力和界面控件。我统一了两端的 MSDK、UXSDK 工具类，并按实际巡检需求适配 SDK 能力。',
      points: [
        {
          title: 'MSDK · 将 SDK 能力接到巡检业务',
          text: 'MSDK 提供无人机飞行相关能力。面对巡检业务需要的线测温，我以 MSDK 提供的点测温能力为基础，做了适配以支持线测温场景。',
        },
        {
          title: 'UXSDK · 定制红外测温控件',
          text: 'UXSDK 提供原始界面控件。我在其基础上定制了红外测温控件，支持点、线、面测温，也能在画面上画线和绘制图形。',
        },
      ],
    },
  ],
  architecture: {
    intro: '以同一张巡检任务列表为例，对比三个 Activity 如何发起请求、展示加载结果和处理页面重建。代码省略 imports、布局与数据源的具体实现。',
    sharedCode: String.raw`data class InspectionTask(val title: String)

interface TaskRepository {
    // 网络失败抛出 IOException，协程取消继续向外传播。
    suspend fun getTasks(): List<InspectionTask>
}

sealed interface TasksUiState {
    object Loading : TasksUiState
    data class Content(val tasks: List<InspectionTask>) : TasksUiState
    object Failed : TasksUiState
}

// 示例中的 Application 负责提供已构造的仓库。
val Activity.taskRepository: TaskRepository
    get() = (application as InspectionApp).taskRepository

suspend fun TaskRepository.loadState(): TasksUiState = try {
    TasksUiState.Content(getTasks())
} catch (_: IOException) {
    TasksUiState.Failed
}

fun ActivityTasksBinding.render(state: TasksUiState) {
    progress.isVisible = state is TasksUiState.Loading
    error.isVisible = state is TasksUiState.Failed
    retry.isVisible = state is TasksUiState.Failed
    taskList.text = (state as? TasksUiState.Content)
        ?.tasks?.joinToString("\n") { it.title }.orEmpty()
}`,
    examples: [
      {
        name: 'MVC',
        responsibility: 'Activity 处理点击、调用仓库，并将结果交给视图渲染。',
        strength: '路径短，适合交互简单的页面。',
        tradeoff: '请求、重试和界面联动都在 Activity 内。状态多了以后，逻辑更难独立测试；旋转屏幕后，新 Activity 会重新加载。',
        code: `class MvcTasksActivity : AppCompatActivity() {
    private lateinit var binding: ActivityTasksBinding
    private var loadJob: Job? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTasksBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.retry.setOnClickListener { loadTasks() }
        loadTasks()
    }

    private fun loadTasks() {
        loadJob?.cancel()
        loadJob = lifecycleScope.launch {
            binding.render(TasksUiState.Loading)
            binding.render(taskRepository.loadState())
        }
    }
    // lifecycleScope 随当前 Activity 销毁而取消。
}`,
      },
      {
        name: 'MVP',
        responsibility: 'Activity 实现 View 接口，Presenter 发起请求，并调用 View 渲染状态。',
        strength: '可以用假仓库和假 View 单独测试 Presenter，Activity 更集中于界面。',
        tradeoff: '要管理 View 的绑定和解绑，以及请求取消。示例中的 Presenter 随 Activity 重建，若想保留结果，需要另外处理状态。',
        code: `interface TasksView {
    fun render(state: TasksUiState)
}

class TasksPresenter(
    private val repository: TaskRepository,
    private val scope: CoroutineScope
) {
    private var view: TasksView? = null
    private var loadJob: Job? = null

    fun attach(view: TasksView) {
        this.view = view
    }

    fun load() {
        loadJob?.cancel()
        loadJob = scope.launch {
            view?.render(TasksUiState.Loading)
            val state = repository.loadState()
            view?.render(state)
        }
    }

    fun detach() {
        view = null
        loadJob?.cancel()
    }
}

class MvpTasksActivity : AppCompatActivity(), TasksView {
    private lateinit var binding: ActivityTasksBinding
    private lateinit var presenter: TasksPresenter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTasksBinding.inflate(layoutInflater)
        setContentView(binding.root)
        presenter = TasksPresenter(taskRepository, lifecycleScope)
        presenter.attach(this)
        binding.retry.setOnClickListener { presenter.load() }
        presenter.load()
    }

    override fun render(state: TasksUiState) = binding.render(state)

    override fun onDestroy() {
        presenter.detach()
        super.onDestroy()
    }
}`,
      },
      {
        name: 'MVVM',
        responsibility: 'ViewModel 加载任务并公开只读 StateFlow，Activity 转发操作、观察状态并渲染。',
        strength: 'ViewModel 无需持有 Activity。旋转屏幕后，新 Activity 可以继续观察原 ViewModel 的任务状态。',
        tradeoff: '需要设计 UiState、配置 ViewModel 创建方式，并约定哪些状态应在进程重启后恢复。',
        code: `class TasksViewModel(private val repository: TaskRepository) : ViewModel() {
    private val _uiState = MutableStateFlow<TasksUiState>(TasksUiState.Loading)
    val uiState: StateFlow<TasksUiState> = _uiState.asStateFlow()
    private var loadJob: Job? = null

    init {
        load()
    }

    fun load() {
        loadJob?.cancel()
        loadJob = viewModelScope.launch {
            _uiState.value = TasksUiState.Loading
            _uiState.value = repository.loadState()
        }
    }
}

class MvvmTasksActivity : AppCompatActivity() {
    private val model: TasksViewModel by viewModels {
        viewModelFactory { initializer { TasksViewModel(taskRepository) } }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityTasksBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.retry.setOnClickListener { model.load() }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                model.uiState.collect { state -> binding.render(state) }
            }
        }
    }
}`,
      },
    ],
    decision: '从这三个实现看，改用 MVVM 的理由是把任务请求和状态放进 ViewModel，再由 Activity 按状态渲染。列表拿到结果前旋转屏幕，前两段示例会销毁旧 Activity 并重新请求；MVVM 示例的请求属于原 ViewModel，新 Activity 一进入 STARTED 就重新收集，拿到当时的加载状态或最新结果。这样也可以通过假仓库直接验证状态从加载进入成功或失败。',
    boundary: 'ViewModel 保留的是配置变更期间的内存状态。进程被系统回收后，任务数据仍要重新获取或从本地存储恢复；SDK 的长时监听也需要独立管理注册和解绑。',
  },
}
